# INTERNAL SPECIFICATION: Mission Briefing Payload (v3.0)

This document is the "Source of Truth" for any AI agent or back-end system interacting with the `projects.payload` JSONB column. It ensures data integrity and consistent interpretation across the ecosystem.

## 1. Core Architecture
Every project stores a **Snapshot** of the briefing at the time of submission. This prevents historical data from breaking when prices or product titles change in the code.

## 2. Payload Structure (JSON)

| Key | Type | Description |
| :--- | :--- | :--- |
| `meta` | Object | `lang`, `currency`, `snapshot_version`, `category_id`. |
| `core_offer` | Object | `{ id, title, price, desc, features }` (Snapshotted). |
| `addons` | Array | List of snapshot objects: `[{ id, title, price, desc }]`. |
| `financials` | Object | `base_price`, `addons_total`, `total_price`. |
| `intelligence` | Object | Raw strings for `objective`, `audience`, `benchmarks`, `assets`. |
| `blueprint` | Object | `architecture_type`, `stack` (array), `custom_needs`, `recommendation_flag`. |
| `project_identity`| Object | `{ title, client_name, organization }` (Formal identity). |
| `logistics` | Object | `{ start_date, endDate, comm_channel, is_private }`. |

## 3. Validation Rules (Zod)
- **Strings**: No empty strings allowed for mandatory fields (objective, title).
- **Numbers**: `total_price` must equal `base_price + addons_total`.
- **Dates**: `start_date` must be ISO-8601 (YYYY-MM-DD) and `>= today`.
- **Arrays**: `tech_stack` and `addons` must be arrays (may be empty).

## 4. Status Workflow (Enum)
1. `Discovery`: Initial briefing received. Awaiting review.
2. `Analysis`: Engineer is reviewing requirements.
3. `Architecture`: Technical blueprint being finalized.
4. `In Progress`: Active development.
5. `Testing`: Quality assurance phase.
6. `Deployed`: Mission completed.

## 5. Security (Ironclad)
- **RLS Policy**: `client_id` must match `auth.uid()`.
- **Encryption**: Sensitive data (asset links) are stored in the payload but only readable by authorized clients/admins.
