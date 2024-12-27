CREATE TABLE food_product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    barcode VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    brands VARCHAR(255) NOT NULL,
    kcal_100g FLOAT NOT NULL,
    fat_100g FLOAT,
    carb_100g FLOAT,
    proteins_100g FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE food_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    barcode VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    custom_food_id INT,
    product_name VARCHAR(255) NOT NULL,
    brands VARCHAR(255),
    amount FLOAT NOT NULL,
    kcal FLOAT NOT NULL,
    fat_g FLOAT,
    carb_g FLOAT,
    proteins_g FLOAT,
    date DATE NOT NULL,
    FOREIGN KEY (custom_food_id) REFERENCES food_product (id) ON DELETE SET NULL
);

CREATE TABLE food_goal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    kcal FLOAT,
    fat_g FLOAT,
    carb_g FLOAT,
    proteins_g FLOAT,
    date DATE NOT NULL
);