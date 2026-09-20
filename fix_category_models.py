with open("src/data/categories.ts", "r") as f:
    text = f.read()

# Update interfaces
text = text.replace(
"""export interface CategoryField {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
  unit?: string;
}""",
"""export interface CategoryField {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
  unit?: string;
  dependsOn?: string;
  dynamicOptions?: Record<string, string[]>;
}"""
)

# Phones models
phone_brand_model = """    fields: [
      { name: "brand", label: "Marka", type: "select", options: ["Apple", "Samsung", "Xiaomi", "Honor", "Realme", "Huawei", "OnePlus", "Google", "Nokia"] },
      { name: "model", label: "Model", type: "text", placeholder: "Məs: iPhone 15 Pro, Galaxy S24" },"""

phone_brand_model_new = """    fields: [
      { name: "brand", label: "Marka", type: "select", options: ["Apple", "Samsung", "Xiaomi", "Honor", "Realme", "Huawei", "OnePlus", "Google", "Nokia"] },
      { 
        name: "model", 
        label: "Model", 
        type: "select", 
        dependsOn: "brand",
        dynamicOptions: {
          "Apple": ["iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15", "iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14", "iPhone 13 Pro Max", "iPhone 13 Pro", "iPhone 13", "iPhone 12 Pro Max", "iPhone 12 Pro", "iPhone 12", "iPhone 11 Pro Max", "iPhone 11 Pro", "iPhone 11", "Digər"],
          "Samsung": ["Galaxy S24 Ultra", "Galaxy S24+", "Galaxy S24", "Galaxy S23 Ultra", "Galaxy S23", "Galaxy A55", "Galaxy A54", "Galaxy Z Fold 5", "Galaxy Z Flip 5", "Digər"],
          "Xiaomi": ["14 Ultra", "14 Pro", "14", "13T Pro", "13T", "Redmi Note 13 Pro+", "Redmi Note 13 Pro", "Poco X6 Pro", "Digər"],
          "Honor": ["Magic6 Pro", "Magic V2", "90", "X9b", "X8b", "Digər"],
          "Realme": ["12 Pro+", "12 Pro", "11 Pro", "C67", "C55", "Digər"],
          "Huawei": ["Pura 70 Ultra", "Pura 70 Pro", "Mate 60 Pro", "Nova 12", "Digər"],
          "OnePlus": ["12", "12R", "11", "Nord 3", "Digər"],
          "Google": ["Pixel 8 Pro", "Pixel 8", "Pixel 7 Pro", "Pixel 7a", "Digər"],
          "Nokia": ["XR21", "X30", "G42", "C32", "Digər"]
        }
      },"""

text = text.replace(phone_brand_model, phone_brand_model_new)

# Cars models
car_brand_model = """    fields: [
      { name: "brand", label: "Marka", type: "select", options: ["Toyota", "Mercedes", "BMW", "Hyundai", "Kia", "LADA (VAZ)", "Nissan", "Chevrolet", "Ford", "Honda", "Lexus", "Mitsubishi", "Opel", "Volkswagen"] },
      { name: "model", label: "Model", type: "text", placeholder: "Məs: Corolla, C-Class, Rio" },"""

car_brand_model_new = """    fields: [
      { name: "brand", label: "Marka", type: "select", options: ["Toyota", "Mercedes", "BMW", "Hyundai", "Kia", "LADA (VAZ)", "Nissan", "Chevrolet", "Ford", "Honda", "Lexus", "Mitsubishi", "Opel", "Volkswagen"] },
      { 
        name: "model", 
        label: "Model", 
        type: "select", 
        dependsOn: "brand",
        dynamicOptions: {
          "Toyota": ["Camry", "Corolla", "Land Cruiser", "Prado", "RAV4", "Prius", "Yaris", "Highlander", "Digər"],
          "Mercedes": ["C-Class", "E-Class", "S-Class", "G-Class", "GLE", "GLC", "V-Class", "Digər"],
          "BMW": ["3 Series", "5 Series", "7 Series", "X5", "X6", "X7", "M5", "Digər"],
          "Hyundai": ["Elantra", "Sonata", "Tucson", "Santa Fe", "Accent", "Creta", "Digər"],
          "Kia": ["Rio", "Optima", "Sportage", "Sorento", "Cerato", "K5", "Digər"],
          "LADA (VAZ)": ["Niva", "Priora", "Granta", "Vesta", "2107", "2106", "Digər"],
          "Nissan": ["Sunny", "Altima", "X-Trail", "Patrol", "Kicks", "Tiida", "Digər"],
          "Chevrolet": ["Cruze", "Malibu", "Camaro", "Tahoe", "Equinox", "Aveo", "Digər"],
          "Ford": ["Focus", "Mustang", "Explorer", "Fusion", "Fiesta", "Transit", "Digər"],
          "Honda": ["Civic", "Accord", "CR-V", "HR-V", "Pilot", "Digər"],
          "Lexus": ["RX", "LX", "NX", "ES", "IS", "GX", "Digər"],
          "Mitsubishi": ["Pajero", "Lancer", "Outlander", "L200", "ASX", "Digər"],
          "Opel": ["Astra", "Corsa", "Insignia", "Vectra", "Zafira", "Digər"],
          "Volkswagen": ["Golf", "Passat", "Tiguan", "Touareg", "Jetta", "Polo", "Digər"]
        }
      },"""

text = text.replace(car_brand_model, car_brand_model_new)

with open("src/data/categories.ts", "w") as f:
    f.write(text)
