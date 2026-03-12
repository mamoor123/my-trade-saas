import os

# Define the structure
structure = {
    "app/api/webhook": "route.ts",
    "app/dashboard": "page.tsx",
    "app/login": "page.tsx",
    "components/pdf": "DossierDocument.tsx",
    "hooks": "useProcessTradeData.ts",
    "lib": "engine.ts"
}

# Create folders and files
for folder, filename in structure.items():
    os.makedirs(folder, exist_ok=True)
    filepath = os.path.join(folder, filename)
    with open(filepath, 'w') as f:
        f.write(f"// TODO: Paste {filename} code here")
    print(f"Created: {filepath}")

with open(".env.local", 'w') as f:
    f.write("# Environment Variables")