import os

def print_tree(startpath):
    # Folders to skip (keeps the output clean)
    ignore_dirs = {
        'node_modules', '__pycache__', '.git', '.idea', '.vscode', 
        'dist', 'build', 'venv', 'env', '.DS_Store', 'site-packages'
    }

    for root, dirs, files in os.walk(startpath):
        # Filter out ignored directories
        dirs[:] = [d for d in dirs if d not in ignore_dirs]
        
        level = root.replace(startpath, '').count(os.sep)
        indent = '│   ' * level
        print(f'{indent}├── {os.path.basename(root)}/')
        
        subindent = '│   ' * (level + 1)
        for f in files:
            if f not in ignore_dirs and not f.endswith('.pyc'):
                print(f'{subindent}├── {f}')

if __name__ == "__main__":
    #Eq prints structure of the current folder
    print(f"Project Structure for: {os.getcwd()}\n")
    print_tree('.')