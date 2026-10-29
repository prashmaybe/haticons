#!/usr/bin/env python3
"""
package-site.py
Packages Haticons for:
1. User Download: code/download/haticons.zip (CSS, fonts, SVGs, SCSS, LESS, documentation)
2. Shared Hosting Deployment: site-deploy.zip (complete code/ directory with .htaccess ready for public_html)
"""

import os
import sys
import zipfile
import shutil
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
CODE_DIR = ROOT_DIR / "code"
DIST_DIR = ROOT_DIR / "dist"
DOWNLOAD_DIR = CODE_DIR / "download"
USER_ZIP_PATH = DOWNLOAD_DIR / "haticons.zip"
DEPLOY_ZIP_PATH = ROOT_DIR / "site-deploy.zip"

def create_user_download_zip():
    print(f"Creating user download bundle at {USER_ZIP_PATH.relative_to(ROOT_DIR)}...")
    DOWNLOAD_DIR.mkdir(parents=True, exist_ok=True)
    
    # Remove existing zip if present
    if USER_ZIP_PATH.exists():
        USER_ZIP_PATH.unlink()

    with zipfile.ZipFile(USER_ZIP_PATH, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as zipf:
        # Add CSS
        css_dir = DIST_DIR / "css"
        if css_dir.exists():
            for root, _, files in os.walk(css_dir):
                for file in sorted(files):
                    file_path = Path(root) / file
                    rel_path = Path("css") / file_path.relative_to(css_dir)
                    zipf.write(file_path, arcname=str(rel_path).replace("\\", "/"))

        # Add Fonts
        fonts_dir = DIST_DIR / "fonts"
        if fonts_dir.exists():
            for file in sorted(fonts_dir.iterdir()):
                if file.is_file():
                    zipf.write(file, arcname=f"fonts/{file.name}")

        # Add SVGs
        svg_dir = DIST_DIR / "svg"
        if svg_dir.exists():
            for file in sorted(svg_dir.iterdir()):
                if file.is_file():
                    zipf.write(file, arcname=f"svg/{file.name}")

        # Add SCSS
        scss_dir = ROOT_DIR / "scss"
        if scss_dir.exists():
            for root, _, files in os.walk(scss_dir):
                for file in sorted(files):
                    file_path = Path(root) / file
                    rel_path = Path("scss") / file_path.relative_to(scss_dir)
                    zipf.write(file_path, arcname=str(rel_path).replace("\\", "/"))

        # Add LESS
        less_dir = ROOT_DIR / "less"
        if less_dir.exists():
            for root, _, files in os.walk(less_dir):
                for file in sorted(files):
                    file_path = Path(root) / file
                    rel_path = Path("less") / file_path.relative_to(less_dir)
                    zipf.write(file_path, arcname=str(rel_path).replace("\\", "/"))

        # Add Root documentation
        for doc in ["README.md", "CHANGELOG.md", "LICENSE"]:
            doc_path = ROOT_DIR / doc
            if doc_path.exists():
                zipf.write(doc_path, arcname=doc)

    size_kb = USER_ZIP_PATH.stat().st_size / 1024
    print(f"User download bundle created successfully: {size_kb:.1f} KB")

def create_shared_hosting_deploy_zip():
    print(f"Creating shared hosting deployment archive at {DEPLOY_ZIP_PATH.relative_to(ROOT_DIR)}...")
    if DEPLOY_ZIP_PATH.exists():
        DEPLOY_ZIP_PATH.unlink()

    file_count = 0
    with zipfile.ZipFile(DEPLOY_ZIP_PATH, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as zipf:
        for root, dirs, files in os.walk(CODE_DIR):
            # Include hidden files like .htaccess
            for file in sorted(files):
                file_path = Path(root) / file
                rel_path = file_path.relative_to(CODE_DIR)
                arcname = str(rel_path).replace("\\", "/")
                zipf.write(file_path, arcname=arcname)
                file_count += 1

    size_mb = DEPLOY_ZIP_PATH.stat().st_size / (1024 * 1024)
    print(f"Shared hosting deploy archive created successfully: {size_mb:.2f} MB ({file_count} files)")

def main():
    create_user_download_zip()
    create_shared_hosting_deploy_zip()
    print("All packages built successfully for shared hosting deployment!")

if __name__ == "__main__":
    main()
