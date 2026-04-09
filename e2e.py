import os
import argparse
import subprocess
import sys


def main():
    parser = argparse.ArgumentParser(description="Run end-to-end tests for the TodoApp.")
    parser.add_argument(
        "--ui",
        action="store_true",
        help="Open Playwright UI mode",
    )
    parser.add_argument(
        "--project",
        default="chromium",
        help="Browser project to run (default: chromium)",
    )
    args = parser.parse_args()

    cmd = ["npx", "playwright", "test"]
    if args.ui:
        cmd = ["npx", "playwright", "test", "--ui"]
    else:
        cmd.extend(["--project", args.project])

    result = subprocess.run(cmd, cwd=os.path.join(os.getcwd(), "e2e"))
    sys.exit(result.returncode)


if __name__ == "__main__":
    main()
