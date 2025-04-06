ALTER TABLE food_goal ADD COLUMN weight_kg FLOAT NULL;

CREATE TABLE user_weight (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    weight_kg FLOAT NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);