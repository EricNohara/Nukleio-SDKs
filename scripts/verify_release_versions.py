"""Fail a release when its tag and package manifest versions disagree."""

from __future__ import annotations

import argparse
import json
import re
import sys
import tomllib
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def npm_versions() -> list[str]:
    core = json.loads((ROOT / "sdks/typescript/core/package.json").read_text())
    react = json.loads((ROOT / "sdks/typescript/react/package.json").read_text())
    expected_dependency = "workspace:^"
    if react["dependencies"]["@nukleio/core"] != expected_dependency:
        raise ValueError(
            "@nukleio/react must use the @nukleio/core workspace:^ dependency"
        )
    return [core["version"], react["version"]]


def python_versions() -> list[str]:
    with (ROOT / "sdks/python/pyproject.toml").open("rb") as stream:
        return [tomllib.load(stream)["project"]["version"]]


def java_versions() -> list[str]:
    root = ET.parse(ROOT / "sdks/java/pom.xml").getroot()
    namespace = {"m": "http://maven.apache.org/POM/4.0.0"}
    version = root.findtext("m:version", namespaces=namespace)
    return [version or ""]


def dotnet_versions() -> list[str]:
    root = ET.parse(ROOT / "sdks/dotnet/src/Nukleio/Nukleio.csproj").getroot()
    version = root.findtext("./PropertyGroup/Version")
    return [version or ""]


PREFIXES = {
    "npm": "npm-v",
    "python": "python-v",
    "java": "java-v",
    "dotnet": "dotnet-v",
    "go": "sdks/go/v",
}

READERS = {
    "npm": npm_versions,
    "python": python_versions,
    "java": java_versions,
    "dotnet": dotnet_versions,
}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("ecosystem", choices=PREFIXES)
    parser.add_argument("tag")
    args = parser.parse_args()

    prefix = PREFIXES[args.ecosystem]
    if not args.tag.startswith(prefix):
        print(f"Expected a tag beginning with {prefix!r}, got {args.tag!r}", file=sys.stderr)
        return 1

    version = args.tag.removeprefix(prefix)
    if not re.fullmatch(
        r"(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?",
        version,
    ):
        print(f"{version!r} is not a supported semantic version", file=sys.stderr)
        return 1

    manifest_versions = READERS.get(args.ecosystem, lambda: [version])()
    if any(item != version for item in manifest_versions):
        print(
            f"Tag version {version} does not match {args.ecosystem} manifest version(s): "
            + ", ".join(manifest_versions),
            file=sys.stderr,
        )
        return 1

    print(f"Verified {args.ecosystem} release {version}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
