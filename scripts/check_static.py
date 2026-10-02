"""Check the complete static bundle before deployment, without external dependencies."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

root = Path(__file__).resolve().parents[1]
errors = []


class References(HTMLParser):
    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key not in ("src", "href") or not value:
                continue
            url = urlsplit(value)
            if url.scheme or url.netloc or not url.path:
                continue
            path = (self.source.parent / unquote(url.path)).resolve()
            if not path.is_relative_to(root) or not path.is_file():
                errors.append(f"{self.source.name}: missing local asset {value}")


for name in ("index.html", "landing-page.html", "admin.html", "login.html",
             "login-mitra.html", "workspace-nakes.html", "workspace-mitra.html"):
    source = root / name
    if not source.is_file():
        errors.append(f"Missing page: {name}")
        continue
    parser = References()
    parser.source = source
    parser.feed(source.read_text())

if errors:
    raise SystemExit("\n".join(errors))
print("All seven pages and their local references are present.")
