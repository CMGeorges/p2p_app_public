def create_user(username: str) -> int:
    with get_connection() as conn:
        cur = conn.execute(
            "INSERT INTO users (username, balance) VALUES (?, 0.0)", (username,)
        )
        return cur.lastrowid

def get_feed(limit: int = 100) -> List[Dict]:
    with get_connection() as conn:
        cur = conn.execute(
            """
            SELECT t.timestamp, su.username as sender, ru.username as recipient,
                   t.amount, t.message
            FROM transactions t
            JOIN users su ON t.sender_id = su.id
            JOIN users ru ON t.recipient_id = ru.id
            ORDER BY t.timestamp DESC
            LIMIT ?
            """,
            (limit,),
        )
        rows = cur.fetchall()
        return [dict(row) for row in rows]
