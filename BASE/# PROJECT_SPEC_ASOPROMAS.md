# PROJECT_SPEC_ASOPROMAS

## Project Name

ASOPROMAS ERP

---

# Purpose

Build a web-based ERP system for ASOPROMAS (Asociación de Producción de Cacao y Derivados Aromas del Sur).

The system manages:

* Members (socios)
* Farms (fincas)
* Cocoa collection (acopio)
* Payments
* Traceability
* Inventory
* Production
* Sales
* Projects
* Certifications
* Training
* Exports

The organization has approximately 200 members.

---

# Technical Stack

Frontend:

* Next.js
* TypeScript
* Tailwind CSS

Backend:

* Laravel 12 API
  OR
* NestJS API

Database:

* PostgreSQL

Authentication:

* JWT
* RBAC (Role Based Access Control)

Storage:

* Local Storage + S3 compatible storage

Deployment:

* Docker
* VPS Linux

---

# Development Strategy

Build in phases.

Do NOT implement everything at once.

Phase 1 must be fully functional before Phase 2.

---

# Phase 1 Modules

1. Authentication
2. Roles and Permissions
3. Members
4. Groups
5. Farms
6. Cocoa Collection
7. Payments
8. Traceability
9. Dashboard

---

# Roles

* SuperAdmin
* Administradora
* Contadora
* Acopio
* Procesamiento
* Proyectos
* PresidenteGrupoBase
* Vigilancia
* Socio

Use RBAC architecture.

---

# Core Entities

## Member

Fields:

* id
* code
* national_id
* first_name
* last_name
* gender
* ethnicity
* phone
* email
* address
* bank_name
* bank_account
* join_date
* status
* cocoa_type
* group_id

Relationships:

* hasMany Farms
* hasMany CocoaDeliveries
* hasMany Payments
* hasMany Trainings

---

## Group

Fields:

* id
* name
* president_member_id
* status

Relationships:

* hasMany Members

---

## Farm

Fields:

* id
* code
* name
* hectares_total
* hectares_cocoa
* cocoa_type
* latitude
* longitude
* certified
* member_id

Relationships:

* belongsTo Member

---

## CollectionEvent

Represents a cocoa collection day.

Fields:

* id
* date
* group_id
* responsible_user_id
* location
* notes

Relationships:

* hasMany CocoaDeliveries

---

## CocoaDelivery

Fields:

* id
* collection_event_id
* member_id
* farm_id
* lot_id
* weight_kg
* price_per_kg
* total_amount
* notes

Relationships:

* belongsTo Member
* belongsTo Farm
* belongsTo Lot

---

## Payment

Fields:

* id
* cocoa_delivery_id
* payment_date
* gross_amount
* deductions
* net_amount
* voucher_number
* status

Relationships:

* belongsTo CocoaDelivery

---

## Lot

Fields:

* id
* lot_code
* creation_date
* total_weight
* status

Purpose:

Traceability.

One lot may contain cocoa from multiple deliveries.

---

# Business Rules

Rule 1:

A member can have multiple farms.

Rule 2:

A cocoa delivery belongs to exactly one member.

Rule 3:

A cocoa delivery belongs to exactly one farm.

Rule 4:

A payment cannot exist without a delivery.

Rule 5:

Records must never be deleted.

Use:

* active
* cancelled
* archived

statuses instead.

Rule 6:

All modifications must be audited.

Store:

* created_by
* updated_by
* created_at
* updated_at

for all entities.

---

# Dashboard Requirements

Administradora Dashboard:

* Total members
* Total cocoa collected
* Pending payments
* Inventory summary
* Active projects

Contadora Dashboard:

* Payments pending
* Debts
* Monthly purchases
* Monthly sales

Socio Dashboard:

* Deliveries
* Payments
* Trainings attended
* Farm information

---

# API Requirements

Use REST API.

Pattern:

GET /api/members

GET /api/members/{id}

POST /api/members

PUT /api/members/{id}

DELETE not allowed.

Use PATCH status changes.

---

# Security Requirements

* JWT Authentication
* Password Reset
* Audit Log
* Role Based Access Control
* Protected Routes
* Input Validation

---

# Future Modules (Phase 2)

* Inventory
* Production
* Recipes
* Sales
* Customers
* Invoices
* Projects
* Inputs
* Training

---

# Future Modules (Phase 3)

* Organic Certification
* Internal Inspections
* Technical Visits
* Export Management
* Mobile App
* Facturación Electrónica Ecuador

---

# Success Criteria

The first release is considered successful if:

* Members can be managed.
* Farms can be managed.
* Cocoa deliveries can be registered.
* Payments can be tracked.
* Traceability lots can be created.
* Role permissions work correctly.
* Members can log in and view their own information.
