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
from PIL import Image


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


def label_for(u: float, v: float, path_length: float) -> tuple[str, str]:
    if v > 0.86 and 0.48 < u < 0.75:
        return "BRAINSTEM", "brainstem"
    if v > 0.69 and u > 0.43:
        return "CEREBELLUM", "cerebellum"
    if path_length > 155 and (v < 0.18 or u < 0.08 or u > 0.92):
        return "CEREBRAL CORTEX", "cortex"
    if u > 0.84:
        return ("VISUAL CORTEX", "visual") if v < 0.62 else ("OCCIPITAL LOBE", "occipital")
    if u > 0.68:
        if v < 0.34:
            return "SUPERIOR PARIETAL LOBULE", "parietal"
        if v < 0.53:
            return "ANGULAR GYRUS", "angular"
        if v < 0.72:
            return "MIDDLE TEMPORAL GYRUS", "temporal"
        return "INFERIOR TEMPORAL GYRUS", "temporal"
    if u > 0.54:
        if v < 0.28:
            return "POSTCENTRAL GYRUS", "somatosensory"
        if v < 0.45:
            return "INTRAPARIETAL SULCUS", "parietal"
        if v < 0.58:
            return "SUPRAMARGINAL GYRUS", "parietal"
        if v < 0.72:
            return "SUPERIOR TEMPORAL GYRUS", "auditory"
        return "MIDDLE TEMPORAL GYRUS", "temporal"
    if u > 0.42:
        if v < 0.3:
            return "CENTRAL SULCUS", "motor"
        if v < 0.48:
            return "PRECENTRAL GYRUS", "motor"
        if v < 0.62:
            return "LATERAL SULCUS", "auditory"
        return "SUPERIOR TEMPORAL GYRUS", "auditory"
    if u > 0.22:
        if v < 0.27:
            return "SUPERIOR FRONTAL GYRUS", "prefrontal"
        if v < 0.48:
            return "MIDDLE FRONTAL GYRUS", "prefrontal"
        if v < 0.65:
            return "INFERIOR FRONTAL GYRUS", "language"
        return "TEMPORAL POLE", "temporal"
    if v < 0.48:
        return "PREFRONTAL CORTEX", "prefrontal"
    if v < 0.68:
        return "INFERIOR FRONTAL GYRUS", "language"
    return "ORBITOFRONTAL CORTEX", "prefrontal"


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
            label, region = label_for(u, v, path_length)
            normalized = [
                [round((x / width - 0.5) * 2.05, 4), round((0.5 - y / height) * 1.9, 4)]
                for x, y in chunk
            ]
            output_paths.append({"label": label, "region": region, "points": normalized})

    payload = {
        "source": source.name,
        "crop": [left, top, right + 1, bottom + 1],
        "paths": output_paths,
    }
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(
        "/* Generated from the uploaded anatomical line drawing. */\n"
        "window.NEURECA_BRAIN_PATHS="
        + json.dumps(payload, separators=(",", ":"))
        + ";\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(output_paths)} paths to {destination}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("usage: generate_brain_paths.py SOURCE.png DESTINATION.js")
    build(Path(sys.argv[1]), Path(sys.argv[2]))
