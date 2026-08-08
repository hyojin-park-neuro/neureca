"""Trace the supplied anatomical line drawing into compact typographic paths.

Run from the repository root:
    python3 _tools/generate_brain_paths.py images/brain-line-reference.png \
        assets/js/home-brain-paths.js
"""

from __future__ import annotations

import json
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter


REGION_LABELS = {
    "cortex": ["CORTEX", "CEREBRAL CORTEX", "CORTICAL SURFACE"],
    "prefrontal": ["PREFRONTAL", "PREFRONTAL CORTEX", "SUPERIOR FRONTAL GYRUS", "MIDDLE FRONTAL GYRUS", "ORBITOFRONTAL CORTEX"],
    "language": ["BROCA'S AREA", "INFERIOR FRONTAL GYRUS", "PARS OPERCULARIS", "PARS TRIANGULARIS"],
    "motor": ["MOTOR CORTEX", "PRECENTRAL GYRUS", "CENTRAL SULCUS", "PRIMARY MOTOR CORTEX"],
    "somatosensory": ["SOMATOSENSORY", "POSTCENTRAL GYRUS", "SOMATOSENSORY CORTEX"],
    "parietal": ["PARIETAL", "PARIETAL CORTEX", "INTRAPARIETAL SULCUS", "SUPERIOR PARIETAL LOBULE", "SUPRAMARGINAL GYRUS"],
    "angular": ["ANGULAR GYRUS", "TEMPOROPARIETAL JUNCTION", "SUPRAMARGINAL GYRUS"],
    "auditory": ["AUDITORY CORTEX", "SUPERIOR TEMPORAL GYRUS", "LATERAL SULCUS", "HESCHL'S GYRUS"],
    "temporal": ["TEMPORAL", "TEMPORAL CORTEX", "MIDDLE TEMPORAL GYRUS", "INFERIOR TEMPORAL GYRUS", "TEMPORAL POLE"],
    "visual": ["VISUAL CORTEX", "PRIMARY VISUAL CORTEX", "CALCARINE SULCUS"],
    "occipital": ["OCCIPITAL", "OCCIPITAL LOBE", "VISUAL ASSOCIATION CORTEX"],
    "cerebellum": ["CEREBELLUM", "CEREBELLAR CORTEX", "CRUS I", "CRUS II", "LOBULE VI"],
    "brainstem": ["BRAINSTEM", "MIDBRAIN", "PONS", "MEDULLA"],
}


def skeletonize(mask: np.ndarray) -> np.ndarray:
    """Zhang-Suen thinning implemented with vectorized NumPy operations."""
    image = np.pad(mask.astype(np.uint8), 1)

    while True:
        changed = False
        for phase in (0, 1):
            center = image[1:-1, 1:-1]
            p2 = image[:-2, 1:-1]
            p3 = image[:-2, 2:]
            p4 = image[1:-1, 2:]
            p5 = image[2:, 2:]
            p6 = image[2:, 1:-1]
            p7 = image[2:, :-2]
            p8 = image[1:-1, :-2]
            p9 = image[:-2, :-2]
            neighbours = p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9
            transitions = (
                ((p2 == 0) & (p3 == 1)).astype(np.uint8)
                + ((p3 == 0) & (p4 == 1)).astype(np.uint8)
                + ((p4 == 0) & (p5 == 1)).astype(np.uint8)
                + ((p5 == 0) & (p6 == 1)).astype(np.uint8)
                + ((p6 == 0) & (p7 == 1)).astype(np.uint8)
                + ((p7 == 0) & (p8 == 1)).astype(np.uint8)
                + ((p8 == 0) & (p9 == 1)).astype(np.uint8)
                + ((p9 == 0) & (p2 == 1)).astype(np.uint8)
            )
            remove = (center == 1) & (neighbours >= 2) & (neighbours <= 6) & (transitions == 1)
            if phase == 0:
                remove &= (p2 * p4 * p6 == 0) & (p4 * p6 * p8 == 0)
            else:
                remove &= (p2 * p4 * p8 == 0) & (p2 * p6 * p8 == 0)
            if np.any(remove):
                center[remove] = 0
                changed = True
        if not changed:
            return image[1:-1, 1:-1].astype(bool)


def make_graph(skeleton: np.ndarray) -> dict[tuple[int, int], list[tuple[int, int]]]:
    pixels = {tuple(point) for point in np.argwhere(skeleton)}
    graph: dict[tuple[int, int], list[tuple[int, int]]] = {}
    orthogonal = ((-1, 0), (0, 1), (1, 0), (0, -1))
    diagonal = ((-1, -1), (-1, 1), (1, 1), (1, -1))

    for y, x in pixels:
        neighbours = [(y + dy, x + dx) for dy, dx in orthogonal if (y + dy, x + dx) in pixels]
        for dy, dx in diagonal:
            candidate = (y + dy, x + dx)
            if candidate not in pixels:
                continue
            # Avoid triangular shortcuts around a one-pixel orthogonal bend.
            if (y + dy, x) in pixels or (y, x + dx) in pixels:
                continue
            neighbours.append(candidate)
        graph[(y, x)] = neighbours
    return graph


def trace_paths(graph: dict[tuple[int, int], list[tuple[int, int]]]) -> list[list[tuple[int, int]]]:
    nodes = {point for point, neighbours in graph.items() if len(neighbours) != 2}
    visited: set[frozenset[tuple[int, int]]] = set()
    paths: list[list[tuple[int, int]]] = []

    def walk(start: tuple[int, int], first: tuple[int, int]) -> list[tuple[int, int]]:
        path = [start, first]
        previous, current = start, first
        visited.add(frozenset((start, first)))
        while current not in nodes:
            choices = [point for point in graph[current] if point != previous]
            if not choices:
                break
            following = choices[0]
            edge = frozenset((current, following))
            if edge in visited:
                break
            visited.add(edge)
            path.append(following)
            previous, current = current, following
        return path

    for node in sorted(nodes):
        for neighbour in graph[node]:
            if frozenset((node, neighbour)) not in visited:
                paths.append(walk(node, neighbour))

    # Closed loops contain no graph node, so collect any edges not reached above.
    for point, neighbours in graph.items():
        for neighbour in neighbours:
            if frozenset((point, neighbour)) not in visited:
                paths.append(walk(point, neighbour))
    return paths


def length(points: list[tuple[float, float]]) -> float:
    return sum(math.dist(a, b) for a, b in zip(points, points[1:]))


def resample(points: list[tuple[int, int]], spacing: float = 4.0) -> list[tuple[float, float]]:
    if len(points) < 2:
        return []
    source = [(float(x), float(y)) for y, x in points]
    distances = [0.0]
    for first, second in zip(source, source[1:]):
        distances.append(distances[-1] + math.dist(first, second))
    total = distances[-1]
    if total < spacing:
        return source
    samples = np.linspace(0.0, total, max(2, int(total / spacing) + 1))
    result: list[tuple[float, float]] = []
    cursor = 0
    for target in samples:
        while cursor + 1 < len(distances) and distances[cursor + 1] < target:
            cursor += 1
        if cursor + 1 >= len(source):
            result.append(source[-1])
            continue
        span = distances[cursor + 1] - distances[cursor]
        ratio = 0.0 if span == 0 else (target - distances[cursor]) / span
        x = source[cursor][0] + (source[cursor + 1][0] - source[cursor][0]) * ratio
        y = source[cursor][1] + (source[cursor + 1][1] - source[cursor][1]) * ratio
        result.append((x, y))
    return result


def split_path(points: list[tuple[float, float]], max_length: float = 190.0) -> list[list[tuple[float, float]]]:
    if length(points) <= max_length:
        return [points]
    chunks: list[list[tuple[float, float]]] = []
    current = [points[0]]
    current_length = 0.0
    for point in points[1:]:
        current_length += math.dist(current[-1], point)
        current.append(point)
        if current_length >= max_length:
            chunks.append(current)
            current = [point]
            current_length = 0.0
    if len(current) > 2:
        if chunks and length(current) < 24:
            chunks[-1].extend(current[1:])
        else:
            chunks.append(current)
    return chunks


def region_for(u: float, v: float, path_length: float = 0.0) -> str:
    if v > 0.86 and 0.48 < u < 0.75:
        return "brainstem"
    if v > 0.69 and u > 0.43:
        return "cerebellum"
    if path_length > 155 and (v < 0.18 or u < 0.08 or u > 0.92):
        return "cortex"
    if u > 0.84:
        return "visual" if v < 0.62 else "occipital"
    if u > 0.68:
        if v < 0.34:
            return "parietal"
        if v < 0.53:
            return "angular"
        if v < 0.72:
            return "temporal"
        return "temporal"
    if u > 0.54:
        if v < 0.28:
            return "somatosensory"
        if v < 0.45:
            return "parietal"
        if v < 0.58:
            return "parietal"
        if v < 0.72:
            return "auditory"
        return "temporal"
    if u > 0.42:
        if v < 0.3:
            return "motor"
        if v < 0.48:
            return "motor"
        if v < 0.62:
            return "auditory"
        return "auditory"
    if u > 0.22:
        if v < 0.27:
            return "prefrontal"
        if v < 0.48:
            return "prefrontal"
        if v < 0.65:
            return "language"
        return "temporal"
    if v < 0.48:
        return "prefrontal"
    if v < 0.68:
        return "language"
    return "prefrontal"


def enclosed_interior(mask: np.ndarray) -> np.ndarray:
    """Return the filled outer silhouette while retaining the original line paths separately."""
    padding = 12
    padded = np.pad(mask, padding)
    walls = Image.fromarray((padded * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(7))
    flooded = walls.copy()
    ImageDraw.floodfill(flooded, (0, 0), 128, thresh=0)
    silhouette = Image.fromarray(((np.asarray(flooded) != 128) * 255).astype(np.uint8))
    silhouette = silhouette.filter(ImageFilter.MinFilter(5))
    interior = np.asarray(silhouette) > 0
    return interior[padding:-padding, padding:-padding]


def rectangle_sum(integral: np.ndarray, left: int, top: int, right: int, bottom: int) -> int:
    return int(integral[bottom, right] - integral[top, right] - integral[bottom, left] + integral[top, left])


def generate_labels(interior: np.ndarray) -> list[dict[str, object]]:
    height, width = interior.shape
    integral = np.pad(interior.astype(np.int64), ((1, 0), (1, 0))).cumsum(0).cumsum(1)
    boxes: list[tuple[float, float, float, float]] = []
    labels: list[dict[str, object]] = []

    def add_label(x: float, y: float, region: str, label: str, size: float, angle: float) -> bool:
        font_pixels = 8.2 * size
        text_width = max(font_pixels * 1.8, len(label) * font_pixels * 0.54)
        text_height = font_pixels * 1.15
        cosine = abs(math.cos(angle))
        sine = abs(math.sin(angle))
        box_width = text_width * cosine + text_height * sine + 4
        box_height = text_width * sine + text_height * cosine + 4
        left = max(0, int(x - box_width / 2))
        right = min(width, int(math.ceil(x + box_width / 2)))
        top = max(0, int(y - box_height / 2))
        bottom = min(height, int(math.ceil(y + box_height / 2)))
        if right <= left or bottom <= top:
            return False
        coverage = rectangle_sum(integral, left, top, right, bottom) / ((right - left) * (bottom - top))
        if coverage < 0.96:
            return False
        for other_left, other_top, other_right, other_bottom in boxes:
            if left < other_right and right > other_left and top < other_bottom and bottom > other_top:
                return False
        boxes.append((left, top, right, bottom))
        labels.append(
            {
                "text": label,
                "region": region,
                "x": round((x / width - 0.5) * 2.05, 4),
                "y": round((0.5 - y / height) * 1.9, 4),
                "size": round(size, 2),
                "angle": round(angle, 3),
            }
        )
        return True

    # Establish a few larger anatomical anchors before packing smaller labels around them.
    priorities = [
        (0.16, 0.35, "prefrontal", 1.5),
        (0.29, 0.54, "language", 1.24),
        (0.43, 0.29, "motor", 1.42),
        (0.54, 0.3, "somatosensory", 1.28),
        (0.65, 0.28, "parietal", 1.5),
        (0.74, 0.48, "angular", 1.3),
        (0.53, 0.6, "auditory", 1.42),
        (0.55, 0.72, "temporal", 1.5),
        (0.84, 0.42, "visual", 1.42),
        (0.89, 0.58, "occipital", 1.35),
        (0.67, 0.81, "cerebellum", 1.48),
        (0.63, 0.93, "brainstem", 1.28),
    ]
    for u, v, region, size in priorities:
        target_x, target_y = u * width, v * height
        candidates = []
        for y in range(max(3, int(target_y) - 90), min(height - 3, int(target_y) + 91), 5):
            for x in range(max(3, int(target_x) - 90), min(width - 3, int(target_x) + 91), 5):
                if region_for(x / width, y / height) != region:
                    continue
                candidates.append(((x - target_x) ** 2 + (y - target_y) ** 2, x, y))
        for _, x, y in sorted(candidates):
            if add_label(x, y, region, REGION_LABELS[region][0], size, 0.0):
                break

    candidates = []
    for y in range(7, height - 7, 11):
        for x in range(7, width - 7, 11):
            seed = ((x * 73856093) ^ (y * 19349663)) & 0xFFFFFFFF
            jitter_x = ((seed >> 4) % 9) - 4
            jitter_y = ((seed >> 9) % 9) - 4
            candidates.append((seed, x + jitter_x, y + jitter_y))
    candidates.sort(key=lambda candidate: candidate[0])

    sizes = (0.58, 0.66, 0.74, 0.84, 0.96, 1.1, 1.26)
    for seed, x, y in candidates:
        if len(labels) >= 420 or x < 1 or y < 1 or x >= width - 1 or y >= height - 1 or not interior[y, x]:
            continue
        region = region_for(x / width, y / height)
        size = sizes[(seed >> 14) % len(sizes)]
        pool = REGION_LABELS[region]
        label = pool[(seed >> 19) % len(pool)]
        angle_step = int((seed >> 25) % 9) - 4
        angle = angle_step * 0.045 if size < 1.1 else angle_step * 0.018
        add_label(float(x), float(y), region, label, size, angle)
    return labels


def build(source: Path, destination: Path) -> None:
    image = Image.open(source).convert("RGBA")
    alpha = np.asarray(image.getchannel("A")) > 127
    rows, columns = np.where(alpha)
    top, bottom = int(rows.min()), int(rows.max())
    left, right = int(columns.min()), int(columns.max())
    cropped = alpha[top : bottom + 1, left : right + 1]
    graph = make_graph(skeletonize(cropped))
    raw_paths = trace_paths(graph)

    height, width = cropped.shape
    output_paths = []
    for raw in raw_paths:
        if length([(float(x), float(y)) for y, x in raw]) < 18:
            continue
        sampled = resample(raw)
        for chunk in split_path(sampled):
            path_length = length(chunk)
            if path_length < 18:
                continue
            center_x = sum(point[0] for point in chunk) / len(chunk)
            center_y = sum(point[1] for point in chunk) / len(chunk)
            u, v = center_x / width, center_y / height
            region = region_for(u, v, path_length)
            normalized = [
                [round((x / width - 0.5) * 2.05, 4), round((0.5 - y / height) * 1.9, 4)]
                for x, y in chunk
            ]
            output_paths.append({"region": region, "points": normalized})

    labels = generate_labels(enclosed_interior(cropped))

    payload = {
        "source": source.name,
        "crop": [left, top, right + 1, bottom + 1],
        "paths": output_paths,
        "labels": labels,
    }
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(
        "/* Generated from the uploaded anatomical line drawing. */\n"
        "window.NEURECA_BRAIN_PATHS="
        + json.dumps(payload, separators=(",", ":"))
        + ";\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(output_paths)} paths and {len(labels)} labels to {destination}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("usage: generate_brain_paths.py SOURCE.png DESTINATION.js")
    build(Path(sys.argv[1]), Path(sys.argv[2]))
