import { Product } from "@/lib/types";

export const products: Product[] = [
  // ===== PROTEINS =====
  // Chicken Breast
  { id: "chicken_breast", name: "Chicken Breast Fillets 1kg", store: "woolworths", price: 12.5, weight_g: 1000, price_per_100g: 1.25, category: "protein" },
  { id: "chicken_breast", name: "Chicken Breast Fillets 1kg", store: "coles", price: 13.0, weight_g: 1000, price_per_100g: 1.3, category: "protein" },
  // Chicken Thigh
  { id: "chicken_thigh", name: "Chicken Thigh Fillets 1kg", store: "woolworths", price: 9.5, weight_g: 1000, price_per_100g: 0.95, category: "protein" },
  { id: "chicken_thigh", name: "Chicken Thigh Fillets 1kg", store: "coles", price: 10.0, weight_g: 1000, price_per_100g: 1.0, category: "protein" },
  // Beef Mince
  { id: "beef_mince", name: "Beef Mince 500g", store: "woolworths", price: 7.0, weight_g: 500, price_per_100g: 1.4, category: "protein" },
  { id: "beef_mince", name: "Beef Mince 500g", store: "coles", price: 6.5, weight_g: 500, price_per_100g: 1.3, category: "protein" },
  // Eggs
  { id: "eggs", name: "Free Range Eggs 12pk", store: "woolworths", price: 5.5, weight_g: 720, price_per_100g: 0.76, category: "protein" },
  { id: "eggs", name: "Free Range Eggs 12pk", store: "coles", price: 5.0, weight_g: 720, price_per_100g: 0.69, category: "protein" },
  // Canned Tuna
  { id: "canned_tuna", name: "Tuna in Springwater 425g", store: "woolworths", price: 3.5, weight_g: 425, price_per_100g: 0.82, category: "protein" },
  { id: "canned_tuna", name: "Tuna in Springwater 425g", store: "coles", price: 3.8, weight_g: 425, price_per_100g: 0.89, category: "protein" },
  // Tofu
  { id: "tofu", name: "Firm Tofu 300g", store: "woolworths", price: 3.0, weight_g: 300, price_per_100g: 1.0, category: "protein" },
  { id: "tofu", name: "Firm Tofu 300g", store: "coles", price: 2.8, weight_g: 300, price_per_100g: 0.93, category: "protein" },
  // Canned Chickpeas
  { id: "canned_chickpeas", name: "Chickpeas 400g", store: "woolworths", price: 1.2, weight_g: 400, price_per_100g: 0.3, category: "protein" },
  { id: "canned_chickpeas", name: "Chickpeas 400g", store: "coles", price: 1.0, weight_g: 400, price_per_100g: 0.25, category: "protein" },
  // Canned Lentils
  { id: "canned_lentils", name: "Brown Lentils 400g", store: "woolworths", price: 1.3, weight_g: 400, price_per_100g: 0.33, category: "protein" },
  { id: "canned_lentils", name: "Brown Lentils 400g", store: "coles", price: 1.1, weight_g: 400, price_per_100g: 0.28, category: "protein" },

  // ===== CARBS =====
  // Jasmine Rice
  { id: "jasmine_rice", name: "Jasmine Rice 2kg", store: "woolworths", price: 5.0, weight_g: 2000, price_per_100g: 0.25, category: "carbs" },
  { id: "jasmine_rice", name: "Jasmine Rice 2kg", store: "coles", price: 4.5, weight_g: 2000, price_per_100g: 0.23, category: "carbs" },
  // Pasta
  { id: "pasta", name: "Penne Pasta 500g", store: "woolworths", price: 1.5, weight_g: 500, price_per_100g: 0.3, category: "carbs" },
  { id: "pasta", name: "Penne Pasta 500g", store: "coles", price: 1.3, weight_g: 500, price_per_100g: 0.26, category: "carbs" },
  // Spaghetti
  { id: "spaghetti", name: "Spaghetti 500g", store: "woolworths", price: 1.5, weight_g: 500, price_per_100g: 0.3, category: "carbs" },
  { id: "spaghetti", name: "Spaghetti 500g", store: "coles", price: 1.2, weight_g: 500, price_per_100g: 0.24, category: "carbs" },
  // Bread
  { id: "bread", name: "Wholemeal Bread 700g", store: "woolworths", price: 3.5, weight_g: 700, price_per_100g: 0.5, category: "carbs" },
  { id: "bread", name: "Wholemeal Bread 700g", store: "coles", price: 3.2, weight_g: 700, price_per_100g: 0.46, category: "carbs" },
  // Wraps
  { id: "wraps", name: "Tortilla Wraps 8pk", store: "woolworths", price: 3.5, weight_g: 560, price_per_100g: 0.63, category: "carbs" },
  { id: "wraps", name: "Tortilla Wraps 8pk", store: "coles", price: 3.0, weight_g: 560, price_per_100g: 0.54, category: "carbs" },
  // Oats
  { id: "oats", name: "Rolled Oats 1kg", store: "woolworths", price: 3.0, weight_g: 1000, price_per_100g: 0.3, category: "carbs" },
  { id: "oats", name: "Rolled Oats 1kg", store: "coles", price: 2.8, weight_g: 1000, price_per_100g: 0.28, category: "carbs" },
  // Noodles
  { id: "instant_noodles", name: "Egg Noodles 400g", store: "woolworths", price: 2.5, weight_g: 400, price_per_100g: 0.63, category: "carbs" },
  { id: "instant_noodles", name: "Egg Noodles 400g", store: "coles", price: 2.2, weight_g: 400, price_per_100g: 0.55, category: "carbs" },
  // Potatoes
  { id: "potatoes", name: "Potatoes 2kg Bag", store: "woolworths", price: 4.5, weight_g: 2000, price_per_100g: 0.23, category: "carbs" },
  { id: "potatoes", name: "Potatoes 2kg Bag", store: "coles", price: 4.0, weight_g: 2000, price_per_100g: 0.2, category: "carbs" },

  // ===== VEGETABLES =====
  // Frozen Mixed Veg
  { id: "frozen_mixed_veg", name: "Frozen Mixed Vegetables 1kg", store: "woolworths", price: 3.5, weight_g: 1000, price_per_100g: 0.35, category: "vegetables" },
  { id: "frozen_mixed_veg", name: "Frozen Mixed Vegetables 1kg", store: "coles", price: 3.0, weight_g: 1000, price_per_100g: 0.3, category: "vegetables" },
  // Frozen Broccoli
  { id: "frozen_broccoli", name: "Frozen Broccoli 500g", store: "woolworths", price: 2.5, weight_g: 500, price_per_100g: 0.5, category: "vegetables" },
  { id: "frozen_broccoli", name: "Frozen Broccoli 500g", store: "coles", price: 2.3, weight_g: 500, price_per_100g: 0.46, category: "vegetables" },
  // Onions
  { id: "onions", name: "Brown Onions 1kg", store: "woolworths", price: 2.5, weight_g: 1000, price_per_100g: 0.25, category: "vegetables" },
  { id: "onions", name: "Brown Onions 1kg", store: "coles", price: 2.3, weight_g: 1000, price_per_100g: 0.23, category: "vegetables" },
  // Garlic
  { id: "garlic", name: "Garlic 3pk", store: "woolworths", price: 2.0, weight_g: 150, price_per_100g: 1.33, category: "vegetables" },
  { id: "garlic", name: "Garlic 3pk", store: "coles", price: 1.8, weight_g: 150, price_per_100g: 1.2, category: "vegetables" },
  // Tomatoes
  { id: "tomatoes", name: "Tomatoes 500g", store: "woolworths", price: 4.0, weight_g: 500, price_per_100g: 0.8, category: "vegetables" },
  { id: "tomatoes", name: "Tomatoes 500g", store: "coles", price: 3.5, weight_g: 500, price_per_100g: 0.7, category: "vegetables" },
  // Canned Tomatoes
  { id: "canned_tomatoes", name: "Canned Diced Tomatoes 400g", store: "woolworths", price: 1.0, weight_g: 400, price_per_100g: 0.25, category: "vegetables" },
  { id: "canned_tomatoes", name: "Canned Diced Tomatoes 400g", store: "coles", price: 0.9, weight_g: 400, price_per_100g: 0.23, category: "vegetables" },
  // Spinach
  { id: "spinach", name: "Baby Spinach 120g", store: "woolworths", price: 3.0, weight_g: 120, price_per_100g: 2.5, category: "vegetables" },
  { id: "spinach", name: "Baby Spinach 120g", store: "coles", price: 2.8, weight_g: 120, price_per_100g: 2.33, category: "vegetables" },
  // Capsicum
  { id: "capsicum", name: "Red Capsicum each", store: "woolworths", price: 2.5, weight_g: 200, price_per_100g: 1.25, category: "vegetables" },
  { id: "capsicum", name: "Red Capsicum each", store: "coles", price: 2.0, weight_g: 200, price_per_100g: 1.0, category: "vegetables" },
  // Carrots
  { id: "carrots", name: "Carrots 1kg", store: "woolworths", price: 2.0, weight_g: 1000, price_per_100g: 0.2, category: "vegetables" },
  { id: "carrots", name: "Carrots 1kg", store: "coles", price: 1.8, weight_g: 1000, price_per_100g: 0.18, category: "vegetables" },
  // Frozen Stir Fry Veg
  { id: "frozen_stir_fry_veg", name: "Frozen Stir Fry Vegetables 500g", store: "woolworths", price: 3.0, weight_g: 500, price_per_100g: 0.6, category: "vegetables" },
  { id: "frozen_stir_fry_veg", name: "Frozen Stir Fry Vegetables 500g", store: "coles", price: 2.8, weight_g: 500, price_per_100g: 0.56, category: "vegetables" },
  // Banana
  { id: "banana", name: "Bananas 1kg", store: "woolworths", price: 3.5, weight_g: 1000, price_per_100g: 0.35, category: "vegetables" },
  { id: "banana", name: "Bananas 1kg", store: "coles", price: 3.2, weight_g: 1000, price_per_100g: 0.32, category: "vegetables" },
  // Cucumber
  { id: "cucumber", name: "Cucumber each", store: "woolworths", price: 1.5, weight_g: 300, price_per_100g: 0.5, category: "vegetables" },
  { id: "cucumber", name: "Cucumber each", store: "coles", price: 1.2, weight_g: 300, price_per_100g: 0.4, category: "vegetables" },

  // ===== DAIRY =====
  // Milk
  { id: "milk", name: "Full Cream Milk 2L", store: "woolworths", price: 3.1, weight_g: 2000, price_per_100g: 0.16, category: "dairy" },
  { id: "milk", name: "Full Cream Milk 2L", store: "coles", price: 2.9, weight_g: 2000, price_per_100g: 0.15, category: "dairy" },
  // Greek Yogurt
  { id: "greek_yogurt", name: "Greek Yogurt 1kg", store: "woolworths", price: 6.0, weight_g: 1000, price_per_100g: 0.6, category: "dairy" },
  { id: "greek_yogurt", name: "Greek Yogurt 1kg", store: "coles", price: 5.5, weight_g: 1000, price_per_100g: 0.55, category: "dairy" },
  // Cheese
  { id: "cheese", name: "Tasty Cheese Block 500g", store: "woolworths", price: 5.5, weight_g: 500, price_per_100g: 1.1, category: "dairy" },
  { id: "cheese", name: "Tasty Cheese Block 500g", store: "coles", price: 5.0, weight_g: 500, price_per_100g: 1.0, category: "dairy" },
  // Butter
  { id: "butter", name: "Butter 250g", store: "woolworths", price: 4.5, weight_g: 250, price_per_100g: 1.8, category: "dairy" },
  { id: "butter", name: "Butter 250g", store: "coles", price: 4.2, weight_g: 250, price_per_100g: 1.68, category: "dairy" },

  // ===== PANTRY =====
  // Vegetable Oil
  { id: "vegetable_oil", name: "Vegetable Oil 1L", store: "woolworths", price: 4.0, weight_g: 1000, price_per_100g: 0.4, category: "pantry" },
  { id: "vegetable_oil", name: "Vegetable Oil 1L", store: "coles", price: 3.5, weight_g: 1000, price_per_100g: 0.35, category: "pantry" },
  // Olive Oil
  { id: "olive_oil", name: "Olive Oil 500ml", store: "woolworths", price: 5.0, weight_g: 500, price_per_100g: 1.0, category: "pantry" },
  { id: "olive_oil", name: "Olive Oil 500ml", store: "coles", price: 4.5, weight_g: 500, price_per_100g: 0.9, category: "pantry" },
  // Sugar
  { id: "sugar", name: "White Sugar 1kg", store: "woolworths", price: 2.5, weight_g: 1000, price_per_100g: 0.25, category: "pantry" },
  { id: "sugar", name: "White Sugar 1kg", store: "coles", price: 2.2, weight_g: 1000, price_per_100g: 0.22, category: "pantry" },
  // Flour
  { id: "flour", name: "Plain Flour 1kg", store: "woolworths", price: 2.0, weight_g: 1000, price_per_100g: 0.2, category: "pantry" },
  { id: "flour", name: "Plain Flour 1kg", store: "coles", price: 1.8, weight_g: 1000, price_per_100g: 0.18, category: "pantry" },
  // Coconut Milk
  { id: "coconut_milk", name: "Coconut Milk 400ml", store: "woolworths", price: 2.0, weight_g: 400, price_per_100g: 0.5, category: "pantry" },
  { id: "coconut_milk", name: "Coconut Milk 400ml", store: "coles", price: 1.8, weight_g: 400, price_per_100g: 0.45, category: "pantry" },
  // Peanut Butter
  { id: "peanut_butter", name: "Peanut Butter 375g", store: "woolworths", price: 4.0, weight_g: 375, price_per_100g: 1.07, category: "pantry" },
  { id: "peanut_butter", name: "Peanut Butter 375g", store: "coles", price: 3.8, weight_g: 375, price_per_100g: 1.01, category: "pantry" },
  // Honey
  { id: "honey", name: "Honey 500g", store: "woolworths", price: 5.0, weight_g: 500, price_per_100g: 1.0, category: "pantry" },
  { id: "honey", name: "Honey 500g", store: "coles", price: 4.5, weight_g: 500, price_per_100g: 0.9, category: "pantry" },
  // Pasta Sauce
  { id: "pasta_sauce", name: "Pasta Sauce 500g", store: "woolworths", price: 3.0, weight_g: 500, price_per_100g: 0.6, category: "pantry" },
  { id: "pasta_sauce", name: "Pasta Sauce 500g", store: "coles", price: 2.5, weight_g: 500, price_per_100g: 0.5, category: "pantry" },

  // ===== SPICES & SAUCES =====
  // Soy Sauce
  { id: "soy_sauce", name: "Soy Sauce 500ml", store: "woolworths", price: 3.0, weight_g: 500, price_per_100g: 0.6, category: "spices_sauces" },
  { id: "soy_sauce", name: "Soy Sauce 500ml", store: "coles", price: 2.8, weight_g: 500, price_per_100g: 0.56, category: "spices_sauces" },
  // Curry Paste
  { id: "curry_paste", name: "Curry Paste 270g", store: "woolworths", price: 3.5, weight_g: 270, price_per_100g: 1.3, category: "spices_sauces" },
  { id: "curry_paste", name: "Curry Paste 270g", store: "coles", price: 3.2, weight_g: 270, price_per_100g: 1.19, category: "spices_sauces" },
  // Cumin
  { id: "cumin", name: "Ground Cumin 30g", store: "woolworths", price: 2.5, weight_g: 30, price_per_100g: 8.33, category: "spices_sauces" },
  { id: "cumin", name: "Ground Cumin 30g", store: "coles", price: 2.2, weight_g: 30, price_per_100g: 7.33, category: "spices_sauces" },
  // Paprika
  { id: "paprika", name: "Paprika 35g", store: "woolworths", price: 2.5, weight_g: 35, price_per_100g: 7.14, category: "spices_sauces" },
  { id: "paprika", name: "Paprika 35g", store: "coles", price: 2.3, weight_g: 35, price_per_100g: 6.57, category: "spices_sauces" },
  // Tomato Paste
  { id: "tomato_paste", name: "Tomato Paste 140g", store: "woolworths", price: 1.2, weight_g: 140, price_per_100g: 0.86, category: "spices_sauces" },
  { id: "tomato_paste", name: "Tomato Paste 140g", store: "coles", price: 1.0, weight_g: 140, price_per_100g: 0.71, category: "spices_sauces" },
  // Sweet Chilli Sauce
  { id: "sweet_chilli", name: "Sweet Chilli Sauce 500ml", store: "woolworths", price: 3.5, weight_g: 500, price_per_100g: 0.7, category: "spices_sauces" },
  { id: "sweet_chilli", name: "Sweet Chilli Sauce 500ml", store: "coles", price: 3.0, weight_g: 500, price_per_100g: 0.6, category: "spices_sauces" },
  // Oyster Sauce
  { id: "oyster_sauce", name: "Oyster Sauce 280ml", store: "woolworths", price: 3.0, weight_g: 280, price_per_100g: 1.07, category: "spices_sauces" },
  { id: "oyster_sauce", name: "Oyster Sauce 280ml", store: "coles", price: 2.8, weight_g: 280, price_per_100g: 1.0, category: "spices_sauces" },
  // Garam Masala
  { id: "garam_masala", name: "Garam Masala 30g", store: "woolworths", price: 2.8, weight_g: 30, price_per_100g: 9.33, category: "spices_sauces" },
  { id: "garam_masala", name: "Garam Masala 30g", store: "coles", price: 2.5, weight_g: 30, price_per_100g: 8.33, category: "spices_sauces" },
  // Turmeric
  { id: "turmeric", name: "Ground Turmeric 30g", store: "woolworths", price: 2.5, weight_g: 30, price_per_100g: 8.33, category: "spices_sauces" },
  { id: "turmeric", name: "Ground Turmeric 30g", store: "coles", price: 2.2, weight_g: 30, price_per_100g: 7.33, category: "spices_sauces" },
];
