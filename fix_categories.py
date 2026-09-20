import re

with open("src/data/categories.ts", "r") as f:
    text = f.read()

# Replace Nəqliyyat fields completely
old_naqliyyat_regex = re.compile(r'  \{\n    id: "2",\n    name: "Nəqliyyat".*?  \},', re.DOTALL)

new_naqliyyat = """  {
    id: "2",
    name: "Nəqliyyat",
    icon: "Car",
    subCategories: ["Avtomobillər", "Ehtiyat hissələri", "Aksesuarlar", "Motosikletlər", "İcarə"],
    fields: [
      { 
        name: "brand", 
        label: "Marka", 
        type: "select", 
        options: ["BMW", "Mercedes", "Audi", "Toyota", "Hyundai", "Kia", "LADA (VAZ)", "Ford", "Nissan", "Chevrolet"] 
      },
      { 
        name: "model", 
        label: "Model", 
        type: "select", 
        dependsOn: "brand",
        dynamicOptions: {
          "BMW": ["X5", "X6", "3 Series", "5 Series", "7 Series", "M5"],
          "Mercedes": ["C-Class", "E-Class", "S-Class", "G-Class", "GLS"],
          "Toyota": ["Camry", "Corolla", "Land Cruiser", "Prado", "RAV4"],
          "Hyundai": ["Elantra", "Sonata", "Tucson", "Santa Fe", "Accent"],
          "LADA (VAZ)": ["2107", "Niva", "Priora", "Vesta", "Granta"]
        }
      },
      {
        name: "year",
        label: "Buraxılış ili",
        type: "select",
        options: Array.from({ length: 30 }, (_, i) => (2024 - i).toString())
      },
      {
        name: "bodyType",
        label: "Ban növü",
        type: "select",
        options: ["Sedan", "SUV", "Off-roader", "Hetçbek", "Kupe", "Krossover", "Universal", "Pikap", "Furqon"]
      },
      {
        name: "color",
        label: "Rəng",
        type: "select",
        options: ["Qara", "Ağ", "Gümüşü", "Boz", "Göy", "Qırmızı", "Yaşıl", "Sarı", "Tünd qırmızı"]
      },
      {
        name: "engine",
        label: "Mühərrikin həcmi, sm³ (L)",
        type: "select",
        options: ["1.0", "1.2", "1.4", "1.5", "1.6", "1.8", "2.0", "2.2", "2.4", "2.5", "3.0", "3.5", "4.0", "4.4", "5.0", "5.5", "Elektrik"]
      },
      {
        name: "horsePower",
        label: "Mühərrikin gücü (a.g.)",
        type: "number",
        placeholder: "Məsələn: 250"
      },
      {
        name: "fuelType",
        label: "Yanacaq növü",
        type: "select",
        options: ["Benzin", "Dizel", "Qaz", "Hibrid", "Elektrik", "Plug-in Hibrid"]
      },
      {
        name: "mileage",
        label: "Yürüş (km)",
        type: "number",
        placeholder: "Məsələn: 125000"
      },
      {
        name: "gearbox",
        label: "Sürətlər qutusu",
        type: "select",
        options: ["Avtomat", "Mexanika", "Robotlaşdırılmış", "Variator"]
      },
      {
        name: "driveTrain",
        label: "Ötürücü",
        type: "select",
        options: ["Ön", "Arxa", "Tam"]
      },
      {
        name: "condition",
        label: "Vəziyyəti",
        type: "select",
        options: ["Vuruğu yoxdur, rənglənməyib", "Vuruğu var", "Rənglənib", "Qəzalı və ya ehtiyat hissələri üçün"]
      }
    ]
  },"""

text = old_naqliyyat_regex.sub(new_naqliyyat, text)

# Write back
with open("src/data/categories.ts", "w") as f:
    f.write(text)
