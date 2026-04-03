import py_compile, os, sys

errors = False
for root, dirs, files in os.walk('Backend'):
    for f in files:
        if f.endswith('.py'):
            path = os.path.join(root, f)
            try:
                py_compile.compile(path, doraise=True)
            except Exception as e:
                print('ERROR', path, e)
                errors = True

if errors:
    sys.exit(1)
print('OK')
