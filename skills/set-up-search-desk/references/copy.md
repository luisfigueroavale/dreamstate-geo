# Copy the templates

When the owner wants the local folders created, run:

```sh
mkdir -p brand.local/assets audience.local search.local
cp brand/identity.md brand/voice.md brand/style.md brand/tokens.css brand.local/
cp brand/assets/README.md brand.local/assets/README.md
cp audience/ideal-reader.md audience.local/ideal-reader.md
cp -r search search.local
```

Do not copy `brand/AGENTS.md` or `audience/AGENTS.md`. Those stay the entry points. Do not commit the local folders.
