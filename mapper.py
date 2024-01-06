#!/usr/bin/env python

import sys
import re

first_line = True

for line in sys.stdin:
    line = line.strip()

    # Saltar la primera línea
    if first_line:
        first_line = False
        continue

    # Elimina comillas dobles y reemplaza espacios con comas etc
    line = line.replace('"', '').replace(' ', ',').replace('(', '').replace(')', '').replace('\'', '')

    # Divide la línea en palabras usando la coma como separador
    words = line.split(',')

    # Itera sobre las palabras y emite cada palabra (ignorando las que contienen números)
    # Para un futuro, mas visual cosas como if word and not any(char.isdigit() for char in word):
    for word in words:
        word = word.strip()
        if word and not re.search(r'\d', word):
            print(f"{word}\t1")
