# DNS Fix — `internal-dns-server`

## What Was Wrong

The assignment guide creates and mounts 3 config files for bind9:
- `named.conf.options` — bind9 options (allow-query, recursion, etc.)
- `named.conf.local` — zone definition for `cloud.local`
- `db.cloud.local` — DNS records (A records for each server)

However, bind9 only reads **`/etc/bind/named.conf`** on startup.
The default `named.conf` that comes with the `internetsystemsconsortium/bind9:9.18` image
does **not** include the above files — so bind9 had no idea the zone existed.

**Result:** DNS queries timed out / no servers could be reached.

---

## The Fix

Two changes were made:

---

### Change 1 — Create `internal-dns-server/named.conf`

Create a new file at `internal-dns-server/named.conf` with the following content:

```
include "/etc/bind/named.conf.options";
include "/etc/bind/named.conf.local";
```

This tells bind9 to read your options and zone files on startup.

**How to create it (PowerShell):**
```powershell
Set-Content internal-dns-server\named.conf 'include "/etc/bind/named.conf.options";'
Add-Content internal-dns-server\named.conf 'include "/etc/bind/named.conf.local";'
```

Or manually: right-click inside the `internal-dns-server` folder → New → Text Document,
name it `named.conf` (remove the `.txt` extension), paste the two lines above, save.

---

### Change 2 — Add the mount to `docker-compose.yml`

In `docker-compose.yml`, find the `internal-dns-server` service and add one line to volumes:

**Before:**
```yaml
internal-dns-server:
    image: internetsystemsconsortium/bind9:9.18
    container_name: internal-dns-server
    ports: [ "1053:53/udp" ]
    volumes:
      - ./internal-dns-server/named.conf.options:/etc/bind/named.conf.options:ro
      - ./internal-dns-server/named.conf.local:/etc/bind/named.conf.local:ro
      - ./internal-dns-server/db.cloud.local:/etc/bind/db.cloud.local:ro
    networks: [cloud-net]
```

**After:**
```yaml
internal-dns-server:
    image: internetsystemsconsortium/bind9:9.18
    container_name: internal-dns-server
    ports: [ "1053:53/udp" ]
    volumes:
      - ./internal-dns-server/named.conf:/etc/bind/named.conf:ro
      - ./internal-dns-server/named.conf.options:/etc/bind/named.conf.options:ro
      - ./internal-dns-server/named.conf.local:/etc/bind/named.conf.local:ro
      - ./internal-dns-server/db.cloud.local:/etc/bind/db.cloud.local:ro
    networks: [cloud-net]
```

Only **one line was added** — the `named.conf` mount. Nothing else changed.

---

### Change 3 — Recreate the container

After making the above changes, recreate the DNS container to apply them:

```powershell
docker rm -f internal-dns-server
docker compose up -d internal-dns-server
```

---

## Verify It Works

Test DNS resolution from inside the Docker network:

```powershell
docker run --rm --network cloud-net alpine sh -c "apk add -q bind-tools && dig @internal-dns-server web-frontend-server.cloud.local +short"
```

Expected output:
```
10.10.10.10
```

---
