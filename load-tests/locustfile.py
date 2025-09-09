from locust import HttpUser, task, between
import json
import random

class SoatTechChallengeUser(HttpUser):
    wait_time = between(1, 3)
    
    def on_start(self):
        self.client.verify = False
    
    @task(3)
    def get_categories(self):
        """Buscar categorias"""
        self.client.get("/categories")
    
    @task(3)
    def get_products(self):
        """Buscar produtos"""
        self.client.get("/products")
    
    @task(2)
    def get_customers(self):
        """Buscar clientes"""
        self.client.get("/customers")
    
    @task(1)
    def create_order(self):
        """Criar pedido"""
        order_data = {
            "customerId": random.randint(1, 100),
            "items": [
                {
                    "productId": random.randint(1, 10),
                    "quantity": random.randint(1, 3)
                }
            ]
        }
        self.client.post("/orders", json=order_data)
    
    @task(1)
    def health_check(self):
        """Health check"""
        self.client.get("/health")