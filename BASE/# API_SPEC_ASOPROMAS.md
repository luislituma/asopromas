# API_SPEC_ASOPROMAS

## API Style

REST API

Base URL:

/api/v1

Authentication:

JWT Bearer Token

---

# AUTH

POST /auth/login

Request:

{
  "email": "user@email.com",
  "password": "password"
}

Response:

{
  "token": "...",
  "user": {},
  "role": {}
}

---

POST /auth/logout

POST /auth/refresh

GET /auth/me

---

# MEMBERS

GET /members

GET /members/{id}

POST /members

PUT /members/{id}

PATCH /members/{id}/status

GET /members/{id}/farms

GET /members/{id}/deliveries

GET /members/{id}/payments

GET /members/{id}/trainings

---

# GROUPS

GET /groups

POST /groups

PUT /groups/{id}

GET /groups/{id}/members

GET /groups/{id}/summary

---

# FARMS

GET /farms

POST /farms

PUT /farms/{id}

GET /farms/{id}

GET /farms/{id}/certifications

GET /farms/{id}/inspections

GET /farms/{id}/visits

---

# COLLECTION EVENTS

GET /collection-events

POST /collection-events

PUT /collection-events/{id}

GET /collection-events/{id}

GET /collection-events/{id}/deliveries

---

# COCOA DELIVERIES

GET /deliveries

POST /deliveries

PUT /deliveries/{id}

GET /deliveries/{id}

GET /deliveries/member/{memberId}

GET /deliveries/lot/{lotId}

---

# LOTS

GET /lots

POST /lots

PUT /lots/{id}

GET /lots/{id}

GET /lots/{id}/traceability

---

# PAYMENTS

GET /payments

POST /payments

PUT /payments/{id}

GET /payments/{id}

POST /payments/{id}/approve

POST /payments/{id}/cancel

---

# PRODUCTS

GET /products

POST /products

PUT /products/{id}

GET /products/{id}

---

# INVENTORY

GET /inventory

GET /inventory/warehouse/{warehouseId}

POST /inventory/movements

GET /inventory/movements

---

# PRODUCTION

GET /production-orders

POST /production-orders

PUT /production-orders/{id}

GET /production-orders/{id}

POST /production-orders/{id}/complete

---

# RECIPES

GET /recipes

POST /recipes

PUT /recipes/{id}

GET /recipes/{id}

---

# SALES

GET /sales

POST /sales

PUT /sales/{id}

GET /sales/{id}

POST /sales/{id}/invoice

---

# CUSTOMERS

GET /customers

POST /customers

PUT /customers/{id}

GET /customers/{id}

---

# PROJECTS

GET /projects

POST /projects

PUT /projects/{id}

GET /projects/{id}

GET /projects/{id}/activities

GET /projects/{id}/beneficiaries

---

# INPUTS

GET /inputs

POST /inputs

PUT /inputs/{id}

POST /inputs/deliveries

GET /inputs/member/{memberId}

---

# TRAININGS

GET /trainings

POST /trainings

PUT /trainings/{id}

POST /trainings/{id}/attendance

GET /trainings/member/{memberId}

---

# CERTIFICATIONS

GET /certifications

POST /certifications

PUT /certifications/{id}

---

# REPORTS

GET /reports/dashboard

GET /reports/collection

GET /reports/payments

GET /reports/sales

GET /reports/inventory

GET /reports/projects

GET /reports/trainings

GET /reports/traceability