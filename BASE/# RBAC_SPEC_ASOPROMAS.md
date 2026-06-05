# RBAC_SPEC_ASOPROMAS

## Authorization Model

RBAC (Role Based Access Control)

Each user belongs to one role.

Permissions are assigned to roles.

No permission is assigned directly to users.

---

# ROLE: SuperAdmin

Full access to all modules.

Can:

* Manage users
* Manage roles
* Configure system
* View audit logs
* Access all records

---

# ROLE: Administradora

Modules:

* Members
* Farms
* Collection
* Inventory
* Production
* Sales
* Projects
* Reports

Permissions:

* Create
* Read
* Update
* Approve

Cannot:

* Modify accounting records after approval

---

# ROLE: Contadora

Modules:

* Payments
* Sales
* Accounts Receivable
* Financial Reports

Permissions:

* Read
* Create
* Update

Can:

* Register payments
* Register invoices
* Register collections

Cannot:

* Modify collection weights
* Modify farm data

---

# ROLE: Acopio

Modules:

* Collection
* Deliveries
* Lots

Permissions:

* Create
* Read
* Update

Can:

* Create collection events
* Register deliveries
* Assign lots

Cannot:

* Register payments
* Modify accounting information

---

# ROLE: Procesamiento

Modules:

* Inventory
* Production
* Recipes

Permissions:

* Create
* Read
* Update

Can:

* Create production orders
* Manage recipes
* Register inventory movements

Cannot:

* Register financial transactions

---

# ROLE: Proyectos

Modules:

* Projects
* Trainings
* Inputs
* Certifications

Permissions:

* Create
* Read
* Update

Can:

* Create trainings
* Register attendance
* Deliver inputs
* Register technical visits

Cannot:

* Approve payments

---

# ROLE: PresidenteGrupoBase

Scope Limited To Assigned Group

Can:

* View members of group
* View collection summaries
* View trainings
* View project participation

Cannot:

* Edit financial records

---

# ROLE: Vigilancia

Read Only Role

Can:

* View reports
* View payments
* View collection
* View projects
* View inventory

Cannot:

* Create
* Update
* Delete

---

# ROLE: Socio

Self Service Portal

Can View:

* Personal profile
* Farms
* Deliveries
* Payments
* Trainings
* Certifications
* Input debts

Can Edit:

* Phone
* Email

Cannot:

* View other members

---

# Audit Rules

Critical records:

* Payments
* Deliveries
* Sales
* Inventory Adjustments
* Production Orders

Must never be deleted.

Use status transitions:

ACTIVE
CANCELLED
ARCHIVED

Store:

* who changed
* when changed
* previous value
* new value

Audit logs required.
