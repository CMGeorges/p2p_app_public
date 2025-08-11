# scripts/generate_architecture.py
from graphviz import Digraph
import os

# Où écrire les fichiers
OUT_DIR = os.path.join("docs")
os.makedirs(OUT_DIR, exist_ok=True)
BASENAME = os.path.join(OUT_DIR, "architecture_p2p_cagnottes")

dot = Digraph(comment="Architecture P2P avec Cagnottes")
dot.attr(rankdir="LR")

# Backend
dot.node('A', 'main.py\n(FastAPI + Routes)', shape='box', style='filled', fillcolor='#f0f8ff')
dot.node('B', 'database.py\n(SQLite + Fonctions)', shape='box', style='filled', fillcolor='#f0f8ff')
dot.edge('A', 'B', label='Appelle les fonctions')

# Tables DB
dot.node('T1', 'users', shape='ellipse', style='filled', fillcolor='#ffe4e1')
dot.node('T2', 'transactions', shape='ellipse', style='filled', fillcolor='#ffe4e1')
dot.node('T3', 'pools', shape='ellipse', style='filled', fillcolor='#ffe4e1')
dot.node('T4', 'pool_contributions', shape='ellipse', style='filled', fillcolor='#ffe4e1')
dot.edge('B', 'T1')
dot.edge('B', 'T2')
dot.edge('B', 'T3')
dot.edge('B', 'T4')

# Endpoints
dot.node('E1', '/signup\n/login', shape='note', style='filled', fillcolor='#ffffe0')
dot.node('E2', '/deposit\n/transfer\n/feed', shape='note', style='filled', fillcolor='#ffffe0')
dot.node('E3', '/pools', shape='note', style='filled', fillcolor='#ffffe0')
dot.node('E4', '/pools/{id}/contribute', shape='note', style='filled', fillcolor='#ffffe0')
for e in ('E1','E2','E3','E4'):
    dot.edge(e, 'A', label='➡')

# Mobile
dot.node('M', 'App.js\n(React Native)', shape='box', style='filled', fillcolor='#e6ffe6')
for e in ('E1','E2','E3','E4'):
    dot.edge('M', e, label='API call')

# Génération PNG & PDF
dot.render(BASENAME, format='png', cleanup=True)
dot.render(BASENAME, format='pdf', cleanup=True)
print(f"Généré: {BASENAME}.png et {BASENAME}.pdf")
