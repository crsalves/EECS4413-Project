-- Database: pet-store
DROP DATABASE IF EXISTS `pet_store`;
CREATE DATABASE IF NOT EXISTS `pet_store`;
USE `pet_store`;

-- `user` table (for customers and administrators)
CREATE TABLE `user` (
    `user_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20),
    `address_street` VARCHAR(255),
    `address_complement` VARCHAR(255),
    `address_province` VARCHAR(100),
    `address_country` VARCHAR(100),
    `address_postal_code` VARCHAR(20),
    `role` ENUM('customer', 'admin') DEFAULT 'customer',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- `category` table
CREATE TABLE `category` (
    `category_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) UNIQUE NOT NULL,
    `description` TEXT
);

-- `product` table
CREATE TABLE `product` (
    `product_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `brand` VARCHAR(255),
    `model` VARCHAR(255),
    `category_id` INT,
    `price` DECIMAL(10, 2) NOT NULL,
    `quantity` INT NOT NULL,
    `image_url` VARCHAR(255),
    `is_featured` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`category_id`) REFERENCES `category`(`category_id`)
);

-- `card_issuer` table
CREATE TABLE `card_issuer` (
    `card_issuer_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name`  VARCHAR(255),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- `payment_type` table
CREATE TABLE `payment_type` (
    `payment_type_id` INT AUTO_INCREMENT PRIMARY KEY,
    `type`  ENUM('credit', 'debit') DEFAULT 'debit' ,
    `card_issuer_id` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`card_issuer_id`) REFERENCES `card_issuer`(`card_issuer_id`)
);

-- `wishlist` table
CREATE TABLE `wishlist` (
    `wishlist_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `product_id` INT NOT NULL,
    `added_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`),
    FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`)
);

-- `shopping_cart` table
CREATE TABLE `shopping_cart` (
    `cart_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `product_id` INT NOT NULL,
    `quantity` INT NOT NULL,
    `added_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`),
    FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`)
);

-- `user_payment_info` table
CREATE TABLE `user_payment_info` (
    `user_payment_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `card_number`  VARCHAR(255),
    `expiry_date`  VARCHAR(20),
    `cvv`  VARCHAR(20),
    `payment_type_id` INT NOT NULL,
    `is_default` BOOLEAN DEFAULT FALSE,
    `added_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`),
    FOREIGN KEY (`payment_type_id`) REFERENCES `payment_type`(`payment_type_id`)
);

-- `user_address` table
CREATE TABLE `user_address` (
    `user_address_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
     `street` VARCHAR(255),
    `complement` VARCHAR(255),
    `city` VARCHAR(100),
    `province` VARCHAR(100),
    `country` VARCHAR(100),
    `postal_code` VARCHAR(20),
    `is_default` BOOLEAN DEFAULT FALSE,
     `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`)

);

-- `order` table
CREATE TABLE `order` (
    `order_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `total_price` DECIMAL(10, 2) NOT NULL,
    `user_payment_id` INT NOT NULL,
    `shipping_address_id` INT NOT NULL,
     `billing_address_id` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`),
    FOREIGN KEY (`user_payment_id`) REFERENCES `user_payment_info`(`user_payment_id`),
    FOREIGN KEY (`shipping_address_id`) REFERENCES `user_address`(`user_address_id`),
    FOREIGN KEY (`billing_address_id`) REFERENCES `user_address`(`user_address_id`)
);

-- `order_items` table
CREATE TABLE `order_items` (
    `order_item_id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_id` INT NOT NULL,
    `product_id` INT NOT NULL,
    `quantity` INT NOT NULL,
    FOREIGN KEY (`order_id`) REFERENCES `order`(`order_id`),
    FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`)
);

-- `review` table
CREATE TABLE `review` (
    `review_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `product_id` INT NOT NULL,
    `rating` INT NOT NULL,
    `comment` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`),
    FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`)
);

-- `sales_history` table
CREATE TABLE `sales_history` (
    `sales_id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_id` INT NOT NULL,
    `admin_id` INT NOT NULL,
    `action` ENUM('created', 'updated', 'cancelled', 'refunded') NOT NULL,
    `details` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`order_id`) REFERENCES `order`(`order_id`),
    FOREIGN KEY (`admin_id`) REFERENCES `user`(`user_id`)
);

-- `payment_logs` table
CREATE TABLE `payment_logs` (
    `payment_log_id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    `status` ENUM('success', 'failed') NOT NULL,
    `details` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`order_id`) REFERENCES `order`(`order_id`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`)
);

-- `admin_logs` table
CREATE TABLE `admin_logs` (
    `log_id` INT AUTO_INCREMENT PRIMARY KEY,
    `admin_id` INT NOT NULL,
    `action` VARCHAR(255) NOT NULL,
    `details` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`admin_id`) REFERENCES `user`(`user_id`)
);

-- CRUD Section
-- Populate the database with sample data
INSERT INTO `user` (`name`, `email`, `password_hash`, `phone`, `address_street`, `address_complement`, `address_province`, `address_country`, `address_postal_code`, `role`)
VALUES
 ('John Doe', 'john.doe@example.com', '$2b$10$iDBdksd5m2g8tAZ5ssAMouxdlGvHr9LVZL.TA/VzAutYgLLt0KgCW', '1234567890', '123 Main St', '', 'Ontario', 'Canada', 'M1A 1A1', 'customer'),
    ('Jane Smith', 'jane.smith@example.com', '$2b$10$iDBdksd5m2g8tAZ5ssAMouxdlGvHr9LVZL.TA/VzAutYgLLt0KgCW', '9876543210', '456 Oak St', '', 'British Columbia', 'Canada', 'V5K 0A1', 'customer'),
    ('Alice Johnson', 'alice.j@example.com', '$2b$10$iDBdksd5m2g8tAZ5ssAMouxdlGvHr9LVZL.TA/VzAutYgLLt0KgCW', '5555555555', '789 Pine St', '', 'Quebec', 'Canada', 'G1R 5P1', 'customer'),
    ('Bob Brown', 'bob.brown@example.com', '$2b$10$iDBdksd5m2g8tAZ5ssAMouxdlGvHr9LVZL.TA/VzAutYgLLt0KgCW', '4444444444', '101 Birch St', '', 'Alberta', 'Canada', 'T2E 1A6', 'customer'),
    ('Charlie Black', 'charlie.b@example.com', '$2b$10$iDBdksd5m2g8tAZ5ssAMouxdlGvHr9LVZL.TA/VzAutYgLLt0KgCW', '1111111111', '202 Maple St', '', 'Manitoba', 'Canada', 'R2C 0A1', 'customer'),
    ('Daisy Green', 'daisy.g@example.com', '$2b$10$iDBdksd5m2g8tAZ5ssAMouxdlGvHr9LVZL.TA/VzAutYgLLt0KgCW', '2222222222', '303 Cedar St', '', 'Nova Scotia', 'Canada', 'B3H 1A1', 'customer'),
    ('Ethan White', 'ethan.w@example.com', '$2b$10$iDBdksd5m2g8tAZ5ssAMouxdlGvHr9LVZL.TA/VzAutYgLLt0KgCW', '3333333333', '404 Spruce St', '', 'Newfoundland', 'Canada', 'A1C 5M1', 'customer'),
    ('Fiona Gray', 'fiona.g@example.com', '$2b$10$iDBdksd5m2g8tAZ5ssAMouxdlGvHr9LVZL.TA/VzAutYgLLt0KgCW', '6666666666', '505 Willow St', '', 'Saskatchewan', 'Canada', 'S4P 3Y1', 'customer'),
    ('George Yellow', 'george.y@example.com', '$2b$10$iDBdksd5m2g8tAZ5ssAMouxdlGvHr9LVZL.TA/VzAutYgLLt0KgCW', '7777777777', '606 Elm St', '', 'Nunavut', 'Canada', 'X0A 0H0', 'customer'),
    ('Hannah Blue', 'hannah.b@example.com', '$2b$10$iDBdksd5m2g8tAZ5ssAMouxdlGvHr9LVZL.TA/VzAutYgLLt0KgCW', '8888888888', '707 Ash St', '', 'Yukon', 'Canada', 'Y1A 1B7', 'customer'),
    ('Admin One', 'admin@admin.com', '$2b$10$1O0oS9fxHV2dODCXQ.YUeeQdIJqNGdyVccUp/cbFdhc8y8P2NCRXK', '1234561234', 'Admin St 1', '', 'Ontario', 'Canada', 'M1A 1A1', 'admin'),
    ('Admin Two', 'admin2@admin.com', '$2b$10$1O0oS9fxHV2dODCXQ.YUeeQdIJqNGdyVccUp/cbFdhc8y8P2NCRXK', '5678905678', 'Admin St 2', '', 'British Columbia', 'Canada', 'V5K 0A1', 'admin'),
    ('Admin Three', 'admin3@admin.com', '$2b$10$1O0oS9fxHV2dODCXQ.YUeeQdIJqNGdyVccUp/cbFdhc8y8P2NCRXK', '7890127890', 'Admin St 3', '', 'Quebec', 'Canada', 'G1R 5P1', 'admin');



-- Insert data into the `category` table
INSERT INTO `category` (`name`, `description`)
VALUES
    ('Dog Supplies', 'product for dogs such as food, toys, and accessories'),
    ('Cat Supplies', 'product for cats including litter, toys, and food'),
    ('Bird Supplies', 'product for birds like cages, food, and toys'),
    ('All', 'All products');

-- Insert data into the `product` table
INSERT INTO `product` (`product_id`, `name`, `description`, `brand`, `model`, `category_id`, `price`, `quantity`, `image_url`, `is_featured`, `created_at`, `updated_at`) VALUES
(1, 'Frisco Holiday Wreath Fetch Squeaky Tennis Ball Dog Toy, Medium, 8 count', 'Description for Frisco Holiday Wreath Fetch Squeaky Tennis Ball Dog Toy, Medium, 8 count', 'PurrBrands', 'ORRED9PE', 1, 34.99, 37, 'assets/images/products/1.jpg', TRUE, '2024-09-13 12:13:52.995000', '2024-04-30 12:13:52.998000'),
(2, 'Chuckit! Ultra Rubber Ball Tough Dog Toy, 2 count, Medium', 'Description for Chuckit! Ultra Rubber Ball Tough Dog Toy, 2 count, Medium', 'PurrBrands', '861HXAFJ', 1, 10.99, 98, 'assets/images/products/2.jpg', TRUE, '2024-03-15 12:13:52.995000', '2024-06-23 12:13:52.999000'),
(3, 'Benebone Bacon Flavor Wishbone Tough Dog Chew Toy, Medium', 'Description for Benebone Bacon Flavor Wishbone Tough Dog Chew Toy, Medium', 'PetCo', '5FO41I7C', 1, 16.81, 85, 'assets/images/products/3.jpg', FALSE, '2024-01-06 12:13:52.995000', '2024-07-12 12:13:52.999000'),
(4, 'Zeus Nosh Strong Bacon Flavour Wishbone Dog Toy, Small', 'Description for Zeus Nosh Strong Bacon Flavour Wishbone Dog Toy, Small', 'HappyPaws', 'JCVQE6PD', 1, 9.99, 50, 'assets/images/products/4.jpg', FALSE, '2024-03-27 12:13:52.995000', '2024-10-11 12:13:52.999000'),
(5, 'Chuckit! Kick Fetch Ball Dog Toy, Large', 'Description for Chuckit! Kick Fetch Ball Dog Toy, Large', 'PawsInc', 'W63UQ5QK', 1, 31.49, 59, 'assets/images/products/5.jpg', TRUE, '2024-02-23 12:13:52.995000', '2024-01-02 12:13:52.999000'),
(6, 'Chuckit! Ultra Duo Tug Tough Dog Toy', 'Description for Chuckit! Ultra Duo Tug Tough Dog Toy', 'FurEver', 'HQLV06Z1', 1, 16.36, 96, 'assets/images/products/6.jpg', FALSE, '2024-11-27 12:13:52.995000', '2024-03-22 12:13:52.999000'),
(7, 'Benebone Rotisserie Chicken Flavor Wishbone Tough Dog Chew Toy, Medium', 'Description for Benebone Rotisserie Chicken Flavor Wishbone Tough Dog Chew Toy, Medium', 'PawsInc', '02WA6VFH', 1, 16.81, 56, 'assets/images/products/7.jpg', TRUE, '2024-07-23 12:13:52.995000', '2024-10-13 12:13:52.999000'),
(8, 'Frisco Monkey Plush with Rope Squeaky Dog Toy, Medium/Large', 'Description for Frisco Monkey Plush with Rope Squeaky Dog Toy, Medium/Large', 'PetCo', 'CEZ1TCAC', 1, 17.23, 52, 'assets/images/products/8.jpg', FALSE, '2024-05-07 12:13:52.995000', '2024-06-23 12:13:52.999000'),
(9, 'Frisco Forest Friends Stuffing-Free Skinny Plush Squeaky Dog Toy, Small to Large', 'Description for Frisco Forest Friends Stuffing-Free Skinny Plush Squeaky Dog Toy, Small to Large', 'PetCo', 'TEHCYPQO', 1, 14.6, 38, 'assets/images/products/9.jpg', TRUE, '2023-12-18 12:13:52.995000', '2024-09-28 12:13:52.999000'),
(10, 'Tonka Mega Tread Rope Tug Dog Toy', 'Description for Tonka Mega Tread Rope Tug Dog Toy', 'FurEver', 'QOKSPGGO', 1, 25.54, 92, 'assets/images/products/10.jpg', TRUE, '2024-09-10 12:13:52.995000', '2024-05-09 12:13:52.999000'),
(11, 'Multipet Loofa Dog The Original Squeaky Plush Dog Toy, Color Varies, Large, 1 count', 'Description for Multipet Loofa Dog The Original Squeaky Plush Dog Toy, Color Varies, Large, 1 count', 'HappyPaws', '8RXI4EJ6', 1, 11.09, 63, 'assets/images/products/11.jpg', FALSE, '2024-10-31 12:13:52.995000', '2024-04-01 12:13:52.999000'),
(12, 'Petstages Dogwood Tough Dog Chew Toy, Medium', 'Description for Petstages Dogwood Tough Dog Chew Toy, Medium', 'PetCo', 'QD3KRX51', 1, 12.99, 89, 'assets/images/products/12.jpg', FALSE, '2023-12-25 12:13:52.995000', '2024-03-25 12:13:52.999000'),
(13, 'Benebone Fishbone Dog Chew Toy, Medium', 'Description for Benebone Fishbone Dog Chew Toy, Medium', 'PawsInc', 'MT8OY5SI', 1, 16.81, 29, 'assets/images/products/13.jpg', FALSE, '2024-06-14 12:13:52.995000', '2024-05-06 12:13:52.999000'),
(14, 'Chuckit! Ultra Rubber Ball Tough Dog Toy, Large', 'Description for Chuckit! Ultra Rubber Ball Tough Dog Toy, Large', 'FurEver', 'IOHBFRK5', 1, 10.99, 55, 'assets/images/products/14.jpg', FALSE, '2024-08-24 12:13:52.995000', '2024-07-20 12:13:52.999000'),
(15, 'Benebone Peanut Butter Flavor Wishbone Tough Dog Chew Toy, Medium', 'Description for Benebone Peanut Butter Flavor Wishbone Tough Dog Chew Toy, Medium', 'PurrBrands', 'H07LJR5M', 1, 16.81, 92, 'assets/images/products/15.jpg', TRUE, '2024-10-16 12:13:52.995000', '2024-07-10 12:13:52.999000'),
(16, 'Zeus Nosh Strong Chicken Flavour Wishbone Dog Toy, Medium', 'Description for Zeus Nosh Strong Chicken Flavour Wishbone Dog Toy, Medium', 'FurEver', 'R2B0M4E8', 1, 11.4, 85, 'assets/images/products/16.jpg', TRUE, '2024-10-14 12:13:52.995000', '2024-11-25 12:13:52.999000'),
(17, 'Outward Hound Invincibles Blue Snake Plush Dog Toy', 'Description for Outward Hound Invincibles Blue Snake Plush Dog Toy', 'FurEver', 'W621KDSL', 1, 15.99, 79, 'assets/images/products/17.jpg', TRUE, '2024-07-04 12:13:52.995000', '2024-09-26 12:13:52.999000'),
(18, 'KONG Classic Dog Toy, Medium', 'Description for KONG Classic Dog Toy, Medium', 'PawsInc', 'MACZ4642', 1, 15.99, 23, 'assets/images/products/18.jpg', TRUE, '2023-12-23 12:13:52.995000', '2024-06-26 12:13:52.999000'),
(19, 'Outward Hound Invincibles Snakes Squeaky Stuffing-Free Plush Dog Toy, 6-Squeak, Color Varies', 'Description for Outward Hound Invincibles Snakes Squeaky Stuffing-Free Plush Dog Toy, 6-Squeak, Color Varies', 'PurrBrands', 'P68MFEA9', 1, 14.57, 61, 'assets/images/products/19.jpg', TRUE, '2024-03-05 12:13:52.995000', '2024-03-01 12:13:52.999000'),
(20, 'KONG Core Strength Bone Dog Toy, Small/Medium', 'Description for KONG Core Strength Bone Dog Toy, Small/Medium', 'PawsInc', 'CVGVLNQ6', 1, 12.99, 24, 'assets/images/products/20.jpg', FALSE, '2024-12-05 12:13:52.995000', '2024-09-24 12:13:52.999000'),
(21, 'KONG Core Strength BowTie Dog Toy, Small/Medium', 'Description for KONG Core Strength BowTie Dog Toy, Small/Medium', 'PetCo', 'MF9X3BQQ', 1, 14.99, 28, 'assets/images/products/21.jpg', TRUE, '2024-11-24 12:13:52.995000', '2024-04-27 12:13:52.999000'),
(22, 'KONG Extreme Tires Dog Toy, Medium/Large', 'Description for KONG Extreme Tires Dog Toy, Medium/Large', 'PawsInc', '80IP9X71', 1, 21.99, 94, 'assets/images/products/22.jpg', TRUE, '2024-03-08 12:13:52.995000', '2024-06-27 12:13:52.999000'),
(23, 'Chuckit! Paraflight Flyer Dog Toy, Large', 'Description for Chuckit! Paraflight Flyer Dog Toy, Large', 'PurrBrands', 'W7QUIEIC', 1, 16.19, 99, 'assets/images/products/23.jpg', TRUE, '2024-03-12 12:13:52.995000', '2024-09-21 12:13:52.999000'),
(24, 'KONG Stuff-A-Ball Dog Toy, Medium', 'Description for KONG Stuff-A-Ball Dog Toy, Medium', 'FurEver', 'REG68MBV', 1, 19.99, 19, 'assets/images/products/24.jpg', FALSE, '2024-01-17 12:13:52.995000', '2024-05-30 12:13:52.999000'),
(25, 'KONG Extreme Goodie Bone Dog Toy, Large', 'Description for KONG Extreme Goodie Bone Dog Toy, Large', 'HappyPaws', '7GHXLAVY', 1, 23.99, 78, 'assets/images/products/25.jpg', FALSE, '2023-12-23 12:13:52.995000', '2024-05-20 12:13:52.999000'),
(26, 'Frisco Sloth Plush Squeaky Dog Toy, Small/Medium', 'Description for Frisco Sloth Plush Squeaky Dog Toy, Small/Medium', 'PurrBrands', 'GVG1MQE8', 1, 9.33, 61, 'assets/images/products/26.jpg', TRUE, '2024-08-18 12:13:52.995000', '2024-10-12 12:13:52.999000'),
(27, 'Frisco Guacamole Hide &amp; Seek Puzzle Plush Squeaky Dog Toy, Small', 'Description for Frisco Guacamole Hide &amp; Seek Puzzle Plush Squeaky Dog Toy, Small', 'PetCo', 'CSE2EP54', 1, 11.69, 11, 'assets/images/products/27.jpg', TRUE, '2024-01-25 12:13:52.995000', '2024-11-20 12:13:52.999000'),
(28, 'KONG Core Strength Ball Dog Toy, Large', 'Description for KONG Core Strength Ball Dog Toy, Large', 'HappyPaws', 'SXFG10U0', 1, 13.99, 72, 'assets/images/products/28.jpg', TRUE, '2024-07-16 12:13:52.995000', '2024-09-28 12:13:52.999000'),
(29, 'Tonka Infinity Tread Tug Dog Toy', 'Description for Tonka Infinity Tread Tug Dog Toy', 'PurrBrands', 'CSGYXA7S', 1, 29.97, 33, 'assets/images/products/29.jpg', TRUE, '2024-10-19 12:13:52.995000', '2024-06-01 12:13:52.999000'),
(30, 'Frisco Flat Plush Squeaking Duck Dog Toy, Medium/Large', 'Description for Frisco Flat Plush Squeaking Duck Dog Toy, Medium/Large', 'HappyPaws', 'OCVKX49D', 1, 11.84, 77, 'assets/images/products/30.jpg', FALSE, '2024-05-17 12:13:52.995000', '2024-02-26 12:13:52.999000'),
(31, 'Nylabone Teething Pacifier Puppy Chew Dog Toy', 'Description for Nylabone Teething Pacifier Puppy Chew Dog Toy', 'HappyPaws', '8LK0KIST', 1, 13.97, 57, 'assets/images/products/31.jpg', TRUE, '2023-12-29 12:13:52.995000', '2024-10-19 12:13:52.999000'),
(32, 'Tonka Mega Tread Ball Dog Toy', 'Description for Tonka Mega Tread Ball Dog Toy', 'FurEver', 'WFR41C0T', 1, 14.97, 30, 'assets/images/products/32.jpg', FALSE, '2024-11-12 12:13:52.995000', '2024-02-13 12:13:52.999000'),
(33, 'Benebone Bacon Flavor Dental Tough Dog Chew Toy, Medium', 'Description for Benebone Bacon Flavor Dental Tough Dog Chew Toy, Medium', 'PetCo', '6CWUBG05', 1, 18.49, 91, 'assets/images/products/33.jpg', FALSE, '2024-09-25 12:13:52.995000', '2024-02-13 12:13:52.999000'),
(34, 'Chuckit! Fetch Ball Medley Dog Toy, Medium, 3 count', 'Description for Chuckit! Fetch Ball Medley Dog Toy, Medium, 3 count', 'PawsInc', '58UWNRL6', 1, 22.49, 32, 'assets/images/products/34.jpg', FALSE, '2024-04-14 12:13:52.995000', '2024-05-24 12:13:52.999000'),
(35, 'Frisco Alligator Stuffing-Free Flat Plush Squeaky Dog Toy, Large', 'Description for Frisco Alligator Stuffing-Free Flat Plush Squeaky Dog Toy, Large', 'HappyPaws', 'PRX5HI0H', 1, 11.1, 46, 'assets/images/products/35.jpg', FALSE, '2024-03-12 12:13:52.995000', '2024-11-12 12:13:52.999000'),
(36, 'West Paw Zogoflex Toppl Tough Treat Dispensing Dog Chew Toy, Aqua Blue, Large', 'Description for West Paw Zogoflex Toppl Tough Treat Dispensing Dog Chew Toy, Aqua Blue, Large', 'PetCo', 'GHBKH4I5', 1, 32.99, 66, 'assets/images/products/36.jpg', FALSE, '2024-01-22 12:13:52.995000', '2024-01-05 12:13:52.999000'),
(37, 'Greenies Original Regular Adult Dental Dog Treats, 54 count', 'Description for Greenies Original Regular Adult Dental Dog Treats, 54 count', 'PurrBrands', 'O1N8V3X4', 1, 52.33, 92, 'assets/images/products/37.jpg', FALSE, '2024-04-14 12:13:52.995000', '2024-10-01 12:13:52.999000'),
(38, 'Greenies Original Large Adult Dental Dog Treats, 1.53-kg box', 'Description for Greenies Original Large Adult Dental Dog Treats, 1.53-kg box', 'FurEver', 'PRLKS4V4', 1, 26.14, 92, 'assets/images/products/38.jpg', TRUE, '2024-04-25 12:13:52.995000', '2024-05-23 12:13:52.999000'),
(39, 'Purina Pro Plan Veterinary Supplements FortiFlora Powdered Probiotic Supplement for Dogs, 1-g sachet, case of 30', 'Description for Purina Pro Plan Veterinary Supplements FortiFlora Powdered Probiotic Supplement for Dogs, 1-g sachet, case of 30', 'PetCo', '4M8J1UJS', 1, 7.03, 60, 'assets/images/products/39.jpg', TRUE, '2023-12-22 12:13:52.995000', '2024-03-02 12:13:52.999000'),
(40, 'Greenies Original Teenie Adult Natural Dental Dog Treats, 1.53-kg box', 'Description for Greenies Original Teenie Adult Natural Dental Dog Treats, 1.53-kg box', 'PetCo', 'CR7TN54H', 1, 29.33, 32, 'assets/images/products/40.jpg', TRUE, '2023-12-27 12:13:52.995000', '2024-11-25 12:13:52.999000'),
(41, 'Greenies Original Petite Adult Dental Dog Treats, 1.53-kg box', 'Description for Greenies Original Petite Adult Dental Dog Treats, 1.53-kg box', 'PurrBrands', '25TELUJZ', 1, 77.01, 71, 'assets/images/products/41.jpg', FALSE, '2024-11-10 12:13:52.995000', '2024-07-07 12:13:52.999000'),
(42, 'Greenies Pill Pockets Chicken Flavour Capsule Size Adult Dog Treats, 60 count', 'Description for Greenies Pill Pockets Chicken Flavour Capsule Size Adult Dog Treats, 60 count', 'FurEver', 'EZRL3179', 1, 97.64, 97, 'assets/images/products/42.jpg', TRUE, '2024-11-29 12:13:52.995000', '2024-06-11 12:13:52.999000'),
(43, 'Nutramax Denamarin with S-Adenosylmethionine &amp; Silybin Tablet Liver Supplement for Large Dogs, 30 count', 'Description for Nutramax Denamarin with S-Adenosylmethionine &amp; Silybin Tablet Liver Supplement for Large Dogs, 30 count', 'PurrBrands', 'H3YDX8XL', 1, 76.88, 22, 'assets/images/products/43.jpg', FALSE, '2024-09-07 12:13:52.995000', '2024-05-30 12:13:52.999000'),
(44, 'Nutramax Cosequin Hip &amp; Joint with Glucosamine, Chondroitin, MSM &amp; Omega-3&#x27;s Soft Chews Joint Supplement for Dogs, 120 count', 'Description for Nutramax Cosequin Hip &amp; Joint with Glucosamine, Chondroitin, MSM &amp; Omega-3&#x27;s Soft Chews Joint Supplement for Dogs, 120 count', 'PawsInc', 'O9GXRI8L', 1, 41.16, 36, 'assets/images/products/44.jpg', TRUE, '2024-09-09 12:13:52.995000', '2024-07-24 12:13:52.999000'),
(45, 'WHIMZEES by Wellness Value Box Dental Chews Natural Grain-Free Dental Dog Treats, Large, 24 count', 'Description for WHIMZEES by Wellness Value Box Dental Chews Natural Grain-Free Dental Dog Treats, Large, 24 count', 'PawsInc', '4WG2C6ER', 1, 94.03, 93, 'assets/images/products/45.jpg', FALSE, '2024-10-06 12:13:52.995000', '2024-09-13 12:13:52.999000'),
(46, 'PetSafe CareLift Handicapped Support Dog Harness, Medium', 'Description for PetSafe CareLift Handicapped Support Dog Harness, Medium', 'HappyPaws', 'HW3U008B', 1, 19.22, 58, 'assets/images/products/46.jpg', FALSE, '2024-07-22 12:13:52.995000', '2024-03-20 12:13:52.999000'),
(47, 'WHIMZEES by Wellness Value Box Dental Chews Natural Grain-Free Dental Dog Treats, Small, 89 count', 'Description for WHIMZEES by Wellness Value Box Dental Chews Natural Grain-Free Dental Dog Treats, Small, 89 count', 'PurrBrands', 'XGSSGDI8', 1, 41.43, 22, 'assets/images/products/47.jpg', FALSE, '2024-11-22 12:13:52.995000', '2024-11-20 12:13:52.999000'),
(48, 'Nutramax Cosequin Hip &amp; Joint Maximum Strength Plus MSM Chewable Tablets Joint Supplement for Dogs, 60 count', 'Description for Nutramax Cosequin Hip &amp; Joint Maximum Strength Plus MSM Chewable Tablets Joint Supplement for Dogs, 60 count', 'PawsInc', '6EMF9WWB', 1, 44.73, 51, 'assets/images/products/48.jpg', FALSE, '2024-08-06 12:13:52.995000', '2024-06-26 12:13:52.999000'),
(49, 'Nutramax Cosequin Hip &amp; Joint Maximum Strength Plus MSM Chewable Tablets Joint Supplement for Dogs, 132 count', 'Description for Nutramax Cosequin Hip &amp; Joint Maximum Strength Plus MSM Chewable Tablets Joint Supplement for Dogs, 132 count', 'PurrBrands', 'X7CUK2X9', 1, 89.51, 54, 'assets/images/products/49.jpg', TRUE, '2024-01-30 12:13:52.995000', '2024-11-10 12:13:52.999000'),
(50, 'Zesty Paws Hip &amp; Joint Mobility Bites Duck Flavored Soft Chews Glucosamine Supplement for Dogs, 90 count', 'Description for Zesty Paws Hip &amp; Joint Mobility Bites Duck Flavored Soft Chews Glucosamine Supplement for Dogs, 90 count', 'PurrBrands', 'KZO68ZR8', 1, 85.22, 26, 'assets/images/products/50.jpg', TRUE, '2024-06-26 12:13:52.995000', '2024-05-15 12:13:52.999000'),
(51, 'WHIMZEES by Wellness Variety Box Dental Chews Natural Grain-Free Dental Dog Treats, Small, 56 count', 'Description for WHIMZEES by Wellness Variety Box Dental Chews Natural Grain-Free Dental Dog Treats, Small, 56 count', 'PetCo', 'JPL8I510', 1, 95.5, 44, 'assets/images/products/51.jpg', FALSE, '2024-07-19 12:13:52.995000', '2024-01-17 12:13:52.999000'),
(52, 'N-Bone Puppy Teething Ring Chicken Flavor Dog Treats, 6 count', 'Description for N-Bone Puppy Teething Ring Chicken Flavor Dog Treats, 6 count', 'PurrBrands', 'HS1YTDNC', 1, 27.06, 19, 'assets/images/products/52.jpg', TRUE, '2024-01-06 12:13:52.995000', '2024-06-13 12:13:52.999000'),
(53, 'WHIMZEES by Wellness Value Box Dental Chews Natural Grain-Free Dental Dog Treats, Medium, 44 count', 'Description for WHIMZEES by Wellness Value Box Dental Chews Natural Grain-Free Dental Dog Treats, Medium, 44 count', 'PawsInc', '9F5UTQA3', 1, 12.51, 20, 'assets/images/products/53.jpg', FALSE, '2024-08-03 12:13:52.995000', '2024-08-05 12:13:52.999000'),
(54, 'Greenies Fresh Teenie Adult Natural Dental Dog Treats, 43 count', 'Description for Greenies Fresh Teenie Adult Natural Dental Dog Treats, 43 count', 'FurEver', 'BG7J9A0B', 1, 47.03, 51, 'assets/images/products/54.jpg', TRUE, '2024-06-30 12:13:52.995000', '2024-09-28 12:13:52.999000'),
(55, 'Purina Pro Plan Veterinary Supplements Calming Care Powdered Canine Calming Probiotic Dog Supplement, 1-g sachet, 30 count', 'Description for Purina Pro Plan Veterinary Supplements Calming Care Powdered Canine Calming Probiotic Dog Supplement, 1-g sachet, 30 count', 'FurEver', '4GUPG6LG', 1, 77.05, 69, 'assets/images/products/55.jpg', FALSE, '2024-05-04 12:13:52.995000', '2023-12-19 12:13:52.999000'),
(56, 'Greenies Pill Pockets Peanut Butter Flavour Capsule Size Adult Dog Treats, 30 count', 'Description for Greenies Pill Pockets Peanut Butter Flavour Capsule Size Adult Dog Treats, 30 count', 'PetCo', '6J5NPMVO', 1, 51.25, 89, 'assets/images/products/56.jpg', FALSE, '2024-04-06 12:13:52.995000', '2024-07-24 12:13:52.999000'),
(57, 'Nutramax Hip &amp; Joint with MSM Chewable Tablets Joint Supplement for Small &amp; Medium Dogs, 132 count', 'Description for Nutramax Hip &amp; Joint with MSM Chewable Tablets Joint Supplement for Small &amp; Medium Dogs, 132 count', 'PetCo', 'RV4M86VH', 1, 85.59, 97, 'assets/images/products/57.jpg', TRUE, '2024-03-04 12:13:52.995000', '2024-04-16 12:13:52.999000'),
(58, 'ProDen PlaqueOff Powder Supplement for Dogs &amp; Cats, 60-g bottle', 'Description for ProDen PlaqueOff Powder Supplement for Dogs &amp; Cats, 60-g bottle', 'PetCo', '1KH18EPB', 1, 46.71, 66, 'assets/images/products/58.jpg', FALSE, '2024-04-10 12:13:52.995000', '2023-12-26 12:13:52.999000'),
(59, 'Nutri-Vet Pre &amp; Probiotics Soft Chews Digestive Supplement for Dogs, 120 count', 'Description for Nutri-Vet Pre &amp; Probiotics Soft Chews Digestive Supplement for Dogs, 120 count', 'PetCo', 'BKSWFRIU', 1, 6.2, 55, 'assets/images/products/59.jpg', TRUE, '2024-04-02 12:13:52.995000', '2024-11-05 12:13:52.999000'),
(60, 'N-Bone Puppy Teething Ring Pumpkin Flavor Dog Treats, 3 count', 'Description for N-Bone Puppy Teething Ring Pumpkin Flavor Dog Treats, 3 count', 'PurrBrands', 'DMU1OCOZ', 1, 8.96, 77, 'assets/images/products/60.jpg', TRUE, '2024-05-10 12:13:52.995000', '2024-02-04 12:13:52.999000'),
(61, 'Zesty Paws Probiotic Bites Pumpkin Flavored Soft Chews Gut Flora &amp; Digestive Supplement for Dogs, 90 count', 'Description for Zesty Paws Probiotic Bites Pumpkin Flavored Soft Chews Gut Flora &amp; Digestive Supplement for Dogs, 90 count', 'HappyPaws', 'FZO9ANC7', 1, 37.94, 74, 'assets/images/products/61.jpg', TRUE, '2024-09-11 12:13:52.995000', '2024-01-06 12:13:52.999000'),
(62, 'WHIMZEES by Wellness Variety Box Dental Chews Natural Grain-Free Dental Dog Treats, Medium, 28 count', 'Description for WHIMZEES by Wellness Variety Box Dental Chews Natural Grain-Free Dental Dog Treats, Medium, 28 count', 'PurrBrands', '8WEHD81I', 1, 45.19, 55, 'assets/images/products/62.jpg', FALSE, '2024-11-06 12:13:52.995000', '2024-04-07 12:13:52.999000'),
(63, 'Milk-Bone Brushing Chews Daily Large Dental Dog Treats, 18 count', 'Description for Milk-Bone Brushing Chews Daily Large Dental Dog Treats, 18 count', 'PurrBrands', 'A5VFTMDY', 1, 87.29, 31, 'assets/images/products/63.jpg', TRUE, '2024-12-11 12:13:52.995000', '2024-05-23 12:13:52.999000'),
(64, 'Nutramax Cobalequin B12 Small Dog &amp; Cat Supplement, 45 count', 'Description for Nutramax Cobalequin B12 Small Dog &amp; Cat Supplement, 45 count', 'PawsInc', '7ZQ6UVF3', 1, 40.84, 86, 'assets/images/products/64.jpg', TRUE, '2024-05-14 12:13:52.995000', '2024-08-21 12:13:52.999000'),
(65, 'WHIMZEES by Wellness Stix Dental Chews Natural Grain-Free Dental Dog Treats, Medium, 14 count', 'Description for WHIMZEES by Wellness Stix Dental Chews Natural Grain-Free Dental Dog Treats, Medium, 14 count', 'PetCo', '4SP4MMLQ', 1, 24.1, 92, 'assets/images/products/65.jpg', TRUE, '2024-01-17 12:13:52.995000', '2024-02-23 12:13:52.999000'),
(66, 'Milk-Bone Brushing Chews Daily Small Dental Dog Treats, 18 count', 'Description for Milk-Bone Brushing Chews Daily Small Dental Dog Treats, 18 count', 'PetCo', 'NFCORCI8', 1, 12.0, 16, 'assets/images/products/66.jpg', FALSE, '2024-10-01 12:13:52.995000', '2024-10-04 12:13:52.999000'),
(67, 'Nutramax Cobalequin B12 Medium Dog Supplement, 45 count', 'Description for Nutramax Cobalequin B12 Medium Dog Supplement, 45 count', 'PawsInc', 'PXLNMLM1', 1, 5.83, 44, 'assets/images/products/67.jpg', FALSE, '2024-06-26 12:13:52.995000', '2024-12-06 12:13:52.999000'),
(68, 'DentaLife Large Breed Daily Oral Care Dog Treats, 28 count', 'Description for DentaLife Large Breed Daily Oral Care Dog Treats, 28 count', 'HappyPaws', 'AF673AOO', 1, 55.95, 68, 'assets/images/products/68.jpg', TRUE, '2024-03-30 12:13:52.995000', '2024-02-14 12:13:52.999000'),
(69, 'Milk-Bone Brushing Chews Daily Medium Dental Dog Treats, 12 count', 'Description for Milk-Bone Brushing Chews Daily Medium Dental Dog Treats, 12 count', 'PetCo', '50OOODWH', 1, 12.24, 57, 'assets/images/products/69.jpg', TRUE, '2024-04-26 12:13:52.995000', '2024-02-08 12:13:52.999000'),
(70, 'ProDen PlaqueOff System Natural Bacon Flavored Dental Bone Dog Treats, 13 count', 'Description for ProDen PlaqueOff System Natural Bacon Flavored Dental Bone Dog Treats, 13 count', 'PurrBrands', 'RBVQ2IDM', 1, 45.22, 41, 'assets/images/products/70.jpg', FALSE, '2024-03-28 12:13:52.995000', '2024-03-28 12:13:52.999000'),
(71, 'Nylabone Advanced Oral Care Dog Dental Water Additive, 32-oz bottle', 'Description for Nylabone Advanced Oral Care Dog Dental Water Additive, 32-oz bottle', 'PetCo', 'AA512ALK', 1, 60.86, 91, 'assets/images/products/71.jpg', TRUE, '2024-08-11 12:13:52.995000', '2024-01-02 12:13:52.999000'),
(72, 'WHIMZEES by Wellness Hedgehog Dental Chews Natural Grain-Free Dental Dog Treats, Large, 6 count', 'Description for WHIMZEES by Wellness Hedgehog Dental Chews Natural Grain-Free Dental Dog Treats, Large, 6 count', 'FurEver', '08631NSU', 1, 25.04, 77, 'assets/images/products/72.jpg', FALSE, '2024-10-16 12:13:52.995000', '2024-08-30 12:13:52.999000'),
(73, 'Purina Pro Plan Specialized Sensitive Skin &amp; Stomach Lamb &amp; Oatmeal Formula Dry Dog Food, 10.9-kg bag', 'Description for Purina Pro Plan Specialized Sensitive Skin &amp; Stomach Lamb &amp; Oatmeal Formula Dry Dog Food, 10.9-kg bag', 'PetCo', 'VIGTVZ4G', 1, 89.99, 38, 'assets/images/products/73.jpg', FALSE, '2024-03-22 12:13:52.995000', '2024-06-08 12:13:52.999000'),
(74, 'Purina Pro Plan Specialized Sensitive Skin &amp; Stomach Salmon &amp; Rice Formula Dry Dog Food, 13.6-kg bag', 'Description for Purina Pro Plan Specialized Sensitive Skin &amp; Stomach Salmon &amp; Rice Formula Dry Dog Food, 13.6-kg bag', 'PetCo', 'UQASZMGF', 1, 92.99, 92, 'assets/images/products/74.jpg', TRUE, '2024-01-26 12:13:52.995000', '2024-10-13 12:13:52.999000'),
(75, 'Hill&#x27;s Science Diet Adult Sensitive Stomach &amp; Sensitive Skin Chicken Recipe Dry Dog Food, 13.6-kg bag', 'Description for Hill&#x27;s Science Diet Adult Sensitive Stomach &amp; Sensitive Skin Chicken Recipe Dry Dog Food, 13.6-kg bag', 'HappyPaws', 'L8ZV4RJA', 1, 105.99, 37, 'assets/images/products/75.jpg', FALSE, '2024-10-28 12:13:52.995000', '2024-07-28 12:13:52.999000'),
(76, 'Hill&#x27;s Science Diet Adult Sensitive Stomach &amp; Sensitive Skin Tender Turkey &amp; Rice Stew Canned Dog Food, 354-g can, case of 12', 'Description for Hill&#x27;s Science Diet Adult Sensitive Stomach &amp; Sensitive Skin Tender Turkey &amp; Rice Stew Canned Dog Food, 354-g can, case of 12', 'FurEver', 'MWRCL12M', 1, 53.66, 90, 'assets/images/products/76.jpg', TRUE, '2024-07-03 12:13:52.995000', '2024-01-30 12:13:52.999000'),
(77, 'Hill&#x27;s Science Diet Adult Perfect Weight Hearty Vegetable &amp; Chicken Stew Canned Dog Food, 354-g can, case of 12', 'Description for Hill&#x27;s Science Diet Adult Perfect Weight Hearty Vegetable &amp; Chicken Stew Canned Dog Food, 354-g can, case of 12', 'PurrBrands', 'YW56FFGZ', 1, 53.66, 37, 'assets/images/products/77.jpg', FALSE, '2024-03-02 12:13:52.995000', '2024-11-01 12:13:52.999000'),
(78, 'Purina Pro Plan Complete Essentials Shredded Blend Chicken &amp; Rice Formula Dry Dog Food, 15.9-kg bag', 'Description for Purina Pro Plan Complete Essentials Shredded Blend Chicken &amp; Rice Formula Dry Dog Food, 15.9-kg bag', 'FurEver', 'TWRDGQZ9', 1, 92.99, 78, 'assets/images/products/78.jpg', FALSE, '2024-07-17 12:13:52.995000', '2024-11-22 12:13:52.999000'),
(79, 'Iams Proactive Health Minichunks Chicken &amp; Whole Grains Recipe Dry Dog Food, 13.6-kg bag', 'Description for Iams Proactive Health Minichunks Chicken &amp; Whole Grains Recipe Dry Dog Food, 13.6-kg bag', 'PawsInc', 'X9MDSHFG', 1, 47.97, 70, 'assets/images/products/79.jpg', TRUE, '2024-01-12 12:13:52.995000', '2024-03-01 12:13:52.999000'),
(80, 'Royal Canin Breed Health Nutrition Golden Retriever Adult Dry Dog Food, 13.6-kg bag', 'Description for Royal Canin Breed Health Nutrition Golden Retriever Adult Dry Dog Food, 13.6-kg bag', 'HappyPaws', 'MDTJCOK0', 1, 101.99, 33, 'assets/images/products/80.jpg', TRUE, '2024-12-13 12:13:52.995000', '2024-03-14 12:13:52.999000'),
(81, 'Blue Buffalo Life Protection Formula Adult Chicken &amp; Brown Rice Recipe Dry Dog Food, 11.7-kg bag', 'Description for Blue Buffalo Life Protection Formula Adult Chicken &amp; Brown Rice Recipe Dry Dog Food, 11.7-kg bag', 'HappyPaws', '6CKLFFHQ', 1, 62.6, 29, 'assets/images/products/81.jpg', FALSE, '2024-03-06 12:13:52.995000', '2024-02-24 12:13:52.999000'),
(82, 'Hill&#x27;s Science Diet Adult Perfect Weight Chicken Recipe Dry Dog Food, 11.3-kg bag', 'Description for Hill&#x27;s Science Diet Adult Perfect Weight Chicken Recipe Dry Dog Food, 11.3-kg bag', 'PawsInc', 'XZYJE6DK', 1, 105.99, 95, 'assets/images/products/82.jpg', TRUE, '2024-05-27 12:13:52.995000', '2024-01-06 12:13:52.999000'),
(83, 'Nutro Natural Choice Large Breed Chicken &amp; Brown Rice Dry Dog Food, 13.6-kg bag', 'Description for Nutro Natural Choice Large Breed Chicken &amp; Brown Rice Dry Dog Food, 13.6-kg bag', 'HappyPaws', 'MV55QD9T', 1, 79.99, 86, 'assets/images/products/83.jpg', TRUE, '2024-06-27 12:13:52.995000', '2024-11-21 12:13:52.999000'),
(84, 'Hill&#x27;s Science Diet Adult Sensitive Stomach &amp; Sensitive Skin Chicken &amp; Vegetable Entree Canned Dog Food, 363-g can, case of 12', 'Description for Hill&#x27;s Science Diet Adult Sensitive Stomach &amp; Sensitive Skin Chicken &amp; Vegetable Entree Canned Dog Food, 363-g can, case of 12', 'PawsInc', 'M7YW3QCJ', 1, 53.66, 51, 'assets/images/products/84.jpg', FALSE, '2024-11-05 12:13:52.995000', '2024-01-01 12:13:52.999000'),
(85, 'Hill&#x27;s Science Diet Adult Chicken &amp; Barley Recipe Dry Dog Food, 15.88-kg bag', 'Description for Hill&#x27;s Science Diet Adult Chicken &amp; Barley Recipe Dry Dog Food, 15.88-kg bag', 'PurrBrands', 'XB0RCECT', 1, 100.99, 87, 'assets/images/products/85.jpg', TRUE, '2024-06-02 12:13:52.995000', '2024-02-24 12:13:52.999000'),
(86, 'Purina Pro Plan Specialized Large Breed Shredded Blend Chicken &amp; Rice Formula Dry Dog Food, 15.4-kg bag', 'Description for Purina Pro Plan Specialized Large Breed Shredded Blend Chicken &amp; Rice Formula Dry Dog Food, 15.4-kg bag', 'PetCo', 'RVC8GZ8H', 1, 92.99, 97, 'assets/images/products/86.jpg', FALSE, '2024-02-27 12:13:52.995000', '2024-11-17 12:13:52.999000'),
(87, 'Hill&#x27;s Science Diet Adult Small Bites Chicken &amp; Barley Recipe Dry Dog Food, 15.88-kg bag', 'Description for Hill&#x27;s Science Diet Adult Small Bites Chicken &amp; Barley Recipe Dry Dog Food, 15.88-kg bag', 'FurEver', 'D5MI2P5I', 1, 100.99, 85, 'assets/images/products/87.jpg', TRUE, '2024-03-10 12:13:52.995000', '2024-08-16 12:13:52.999000'),
(88, 'Merrick Real Texas Beef + Sweet Potato Recipe Grain-Free Chicken-Free Adult Dry Dog Food, 1.81-kg bag', 'Description for Merrick Real Texas Beef + Sweet Potato Recipe Grain-Free Chicken-Free Adult Dry Dog Food, 1.81-kg bag', 'PawsInc', 'FA93AZCY', 1, 31.99, 49, 'assets/images/products/88.jpg', FALSE, '2024-08-21 12:13:52.995000', '2024-07-17 12:13:52.999000'),
(89, 'Iams Proactive Health Chicken &amp; Whole Grains Recipe Adult Large Breed Dry Dog Food, 13.6-kg bag', 'Description for Iams Proactive Health Chicken &amp; Whole Grains Recipe Adult Large Breed Dry Dog Food, 13.6-kg bag', 'FurEver', 'VG3IG9NT', 1, 48.59, 42, 'assets/images/products/89.jpg', FALSE, '2024-12-09 12:13:52.995000', '2024-11-09 12:13:52.999000'),
(90, 'Blue Buffalo Life Protection Formula Natural Healthy Weight Adult Chicken Dry Dog Food, 11.7-kg bag', 'Description for Blue Buffalo Life Protection Formula Natural Healthy Weight Adult Chicken Dry Dog Food, 11.7-kg bag', 'PawsInc', 'U3CAAJSU', 1, 63.1, 92, 'assets/images/products/90.jpg', FALSE, '2024-05-30 12:13:52.995000', '2024-05-23 12:13:52.999000'),
(91, 'Blue Buffalo Life Protection Formula Natural Large Breed Adult Chicken Dry Dog Food, 11.7-kg bag', 'Description for Blue Buffalo Life Protection Formula Natural Large Breed Adult Chicken Dry Dog Food, 11.7-kg bag', 'HappyPaws', '73GFSWHC', 1, 64.97, 71, 'assets/images/products/91.jpg', FALSE, '2024-02-24 12:13:52.995000', '2023-12-21 12:13:52.999000'),
(92, 'Stella &amp; Chewy&#x27;s Stella&#x27;s Super Beef Meal Mixers Freeze-Dried Raw Dog Food Topper, 35-oz bag', 'Description for Stella &amp; Chewy&#x27;s Stella&#x27;s Super Beef Meal Mixers Freeze-Dried Raw Dog Food Topper, 35-oz bag', 'PurrBrands', '7JP13M03', 1, 86.54, 21, 'assets/images/products/92.jpg', FALSE, '2024-11-24 12:13:52.995000', '2024-08-11 12:13:52.999000'),
(93, 'Purina ONE Classic Ground Beef &amp; Brown Rice Entree Wet Dog Food, 368-g can, case of 12', 'Description for Purina ONE Classic Ground Beef &amp; Brown Rice Entree Wet Dog Food, 368-g can, case of 12', 'FurEver', 'Q3GPS644', 1, 32.04, 24, 'assets/images/products/93.jpg', FALSE, '2024-01-28 12:13:52.995000', '2024-09-20 12:13:52.999000'),
(94, 'Iams Proactive Health Minichunks Adult Lamb &amp; Rice Dry Dog Food, 13.6-kg bag', 'Description for Iams Proactive Health Minichunks Adult Lamb &amp; Rice Dry Dog Food, 13.6-kg bag', 'PurrBrands', '56AYV3I9', 1, 47.97, 89, 'assets/images/products/94.jpg', TRUE, '2024-06-10 12:13:52.995000', '2024-07-20 12:13:52.999000'),
(95, 'Purina Pro Plan Complete Essentials Chicken &amp; Rice Entree Wet Dog Food, 368-g can, case of 12', 'Description for Purina Pro Plan Complete Essentials Chicken &amp; Rice Entree Wet Dog Food, 368-g can, case of 12', 'PawsInc', 'LP5CKYH7', 1, 51.44, 62, 'assets/images/products/95.jpg', TRUE, '2024-09-05 12:13:52.995000', '2024-10-14 12:13:52.999000'),
(96, 'Wellness Thick &amp; Chunky Beef Stew with Carrots &amp; Potatoes Grain-Free Canned Dog Food, 354-g can, case of 12', 'Description for Wellness Thick &amp; Chunky Beef Stew with Carrots &amp; Potatoes Grain-Free Canned Dog Food, 354-g can, case of 12', 'PurrBrands', 'KLPJU9CG', 1, 69.48, 83, 'assets/images/products/96.jpg', TRUE, '2024-08-03 12:13:52.996000', '2024-07-05 12:13:52.999000'),
(97, 'Hill&#x27;s Science Diet Puppy Large Breed Chicken Meal &amp; Brown Rice Recipe Dry Dog Food, 12.5-kg bag', 'Description for Hill&#x27;s Science Diet Puppy Large Breed Chicken Meal &amp; Brown Rice Recipe Dry Dog Food, 12.5-kg bag', 'HappyPaws', 'G6E66K1D', 1, 97.99, 98, 'assets/images/products/97.jpg', FALSE, '2023-12-19 12:13:52.996000', '2024-02-12 12:13:52.999000'),
(98, 'Purina ONE +Plus Large Breed Formula Chicken Dry Dog Food, 14-kg bag', 'Description for Purina ONE +Plus Large Breed Formula Chicken Dry Dog Food, 14-kg bag', 'PetCo', 'KD4KRNJ7', 1, 44.99, 70, 'assets/images/products/98.jpg', TRUE, '2024-06-13 12:13:52.996000', '2024-10-24 12:13:52.999000'),
(99, 'Wellness Large Breed Complete Health Adult Deboned Chicken &amp; Brown Rice Recipe Dry Dog Food, 13.6-kg bag', 'Description for Wellness Large Breed Complete Health Adult Deboned Chicken &amp; Brown Rice Recipe Dry Dog Food, 13.6-kg bag', 'PawsInc', '0AUIA6DL', 1, 99.99, 76, 'assets/images/products/99.jpg', TRUE, '2024-02-16 12:13:52.996000', '2024-07-29 12:13:52.999000'),
(100, 'Hill&#x27;s Science Diet Adult Sensitive Stomach &amp; Sensitive Skin Large Breed Dry Dog Food, Chicken Recipe, 13.6-kg bag', 'Description for Hill&#x27;s Science Diet Adult Sensitive Stomach &amp; Sensitive Skin Large Breed Dry Dog Food, Chicken Recipe, 13.6-kg bag', 'HappyPaws', '91AT9FDN', 1, 103.99, 60, 'assets/images/products/100.jpg', FALSE, '2024-11-28 12:13:52.996000', '2024-07-11 12:13:52.999000'),
(101, 'Hill&#x27;s Science Diet Adult Large Breed Lamb Meal &amp; Brown Rice Dry Dog Food, 14.9-kg bag', 'Description for Hill&#x27;s Science Diet Adult Large Breed Lamb Meal &amp; Brown Rice Dry Dog Food, 14.9-kg bag', 'FurEver', 'FNBBYJKW', 1, 98.99, 28, 'assets/images/products/101.jpg', FALSE, '2024-05-12 12:13:52.996000', '2024-07-15 12:13:52.999000'),
(102, 'Iams Proactive Health Healthy Weight with Real Chicken Dry Dog Food, 13.2-kg bag', 'Description for Iams Proactive Health Healthy Weight with Real Chicken Dry Dog Food, 13.2-kg bag', 'HappyPaws', '68QOCFYW', 1, 47.97, 72, 'assets/images/products/102.jpg', FALSE, '2024-11-09 12:13:52.996000', '2024-04-01 12:13:52.999000'),
(103, 'Blue Buffalo Wilderness More Meat &amp; Wholesome Grains Adult Chicken Dry Dog Food, 10.8-kg bag', 'Description for Blue Buffalo Wilderness More Meat &amp; Wholesome Grains Adult Chicken Dry Dog Food, 10.8-kg bag', 'PurrBrands', 'MLIHS7WJ', 1, 69.99, 22, 'assets/images/products/103.jpg', TRUE, '2024-03-02 12:13:52.996000', '2024-10-14 12:13:52.999000'),
(104, 'Cesar Classic Loaf in Sauce Beef Selects Variety Pack Adult Wet Dog Food, 100-g tray, case of 24', 'Description for Cesar Classic Loaf in Sauce Beef Selects Variety Pack Adult Wet Dog Food, 100-g tray, case of 24', 'PetCo', '6FA7GTAF', 1, 36.97, 13, 'assets/images/products/104.jpg', FALSE, '2024-10-23 12:13:52.996000', '2024-02-07 12:13:52.999000'),
(105, 'Royal Canin Breed Health Nutrition Labrador Retriever Adult Dry Dog Food, 13.6-kg bag', 'Description for Royal Canin Breed Health Nutrition Labrador Retriever Adult Dry Dog Food, 13.6-kg bag', 'FurEver', 'WV0WMBNC', 1, 101.99, 89, 'assets/images/products/105.jpg', TRUE, '2024-02-19 12:13:52.996000', '2024-04-21 12:13:52.999000'),
(106, 'Purina Pro Plan Specialized Sensitive Skin &amp; Stomach Lamb &amp; Oatmeal Formula Dry Dog Food, 10.9-kg bag', 'Description for Purina Pro Plan Specialized Sensitive Skin &amp; Stomach Lamb &amp; Oatmeal Formula Dry Dog Food, 10.9-kg bag', 'FurEver', 'FQQXZ0AX', 1, 89.99, 21, 'assets/images/products/106.jpg', TRUE, '2024-01-29 12:13:52.996000', '2024-07-08 12:13:52.999000'),
(107, 'Nutro Natural Choice Chicken &amp; Brown Rice Recipe Dry Dog Food, 13.6-kg bag', 'Description for Nutro Natural Choice Chicken &amp; Brown Rice Recipe Dry Dog Food, 13.6-kg bag', 'HappyPaws', 'QPGHTBH2', 1, 69.99, 27, 'assets/images/products/107.jpg', FALSE, '2024-04-27 12:13:52.996000', '2024-01-20 12:13:52.999000'),
(108, 'Purina ONE SmartBlend Large Breed Puppy Formula Chicken Dry Dog Food, 14-kg bag', 'Description for Purina ONE SmartBlend Large Breed Puppy Formula Chicken Dry Dog Food, 14-kg bag', 'FurEver', 'DCB4PFO4', 1, 44.99, 55, 'assets/images/products/108.jpg', TRUE, '2024-02-19 12:13:52.996000', '2024-05-01 12:13:52.999000'),
(109, 'Flexi Xtreme Tape Retractable Dog Leash, Large: 5-m long', 'Description for Flexi Xtreme Tape Retractable Dog Leash, Large: 5-m long', 'PurrBrands', 'V2MIK8SI', 1, 54.99, 59, 'assets/images/products/109.jpg', FALSE, '2024-09-03 12:13:52.996000', '2024-11-25 12:13:52.999000'),
(110, 'Flexi Classic Nylon Tape Retractable Dog Leash, Black, Small: 5-m long', 'Description for Flexi Classic Nylon Tape Retractable Dog Leash, Black, Small: 5-m long', 'PetCo', 'L9EQRX8O', 1, 20.9, 96, 'assets/images/products/110.jpg', FALSE, '2024-05-03 12:13:52.996000', '2024-08-15 12:13:52.999000'),
(111, 'Frisco Solid Nylon Dog Leash, Black, Medium: 6-ft long, 3/4-in wide', 'Description for Frisco Solid Nylon Dog Leash, Black, Medium: 6-ft long, 3/4-in wide', 'PetCo', '9P74XCHW', 1, 8.51, 40, 'assets/images/products/111.jpg', TRUE, '2024-08-05 12:13:52.996000', '2024-10-23 12:13:52.999000'),
(112, 'SportDOG FieldTrainer 425XS Waterproof Stubborn Training Dog Collar', 'Description for SportDOG FieldTrainer 425XS Waterproof Stubborn Training Dog Collar', 'FurEver', 'DTLWOM1R', 1, 238.95, 85, 'assets/images/products/112.jpg', TRUE, '2024-11-15 12:13:52.996000', '2024-04-16 12:13:52.999000'),
(113, 'SportDOG SportTrainer 575E Remote Training Dog Collar', 'Description for SportDOG SportTrainer 575E Remote Training Dog Collar', 'HappyPaws', '1YENRMFC', 1, 290.97, 47, 'assets/images/products/113.jpg', FALSE, '2024-06-07 12:13:52.996000', '2024-03-12 12:13:52.999000'),
(114, 'SportDOG FieldTrainer 425X Remote Training Dog Collar', 'Description for SportDOG FieldTrainer 425X Remote Training Dog Collar', 'PetCo', 'W30YJ17T', 1, 259.99, 85, 'assets/images/products/114.jpg', TRUE, '2024-07-10 12:13:52.996000', '2024-06-17 12:13:52.999000'),
(115, 'SportDOG WetlandHunter 425X Remote Training Dog Collar', 'Description for SportDOG WetlandHunter 425X Remote Training Dog Collar', 'PetCo', '9JT7ITOI', 1, 300.99, 91, 'assets/images/products/115.jpg', FALSE, '2024-08-22 12:13:52.996000', '2024-05-31 12:13:52.999000'),
(116, 'SportDOG YardTrainer Model 300 Training Dog Collar', 'Description for SportDOG YardTrainer Model 300 Training Dog Collar', 'FurEver', '5ACWGPSC', 1, 198.54, 42, 'assets/images/products/116.jpg', FALSE, '2024-07-14 12:13:52.996000', '2024-06-24 12:13:52.999000'),
(117, 'PetSafe Easy Walk No Pull Dog Headcollar, Medium', 'Description for PetSafe Easy Walk No Pull Dog Headcollar, Medium', 'PetCo', 'S3QPR72B', 1, 29.99, 38, 'assets/images/products/117.jpg', FALSE, '2024-10-31 12:13:52.996000', '2024-05-02 12:13:52.999000'),
(118, 'SportDOG SportTrainer 1275E Remote Training Dog Collar', 'Description for SportDOG SportTrainer 1275E Remote Training Dog Collar', 'HappyPaws', '3OC1VQ9T', 1, 343.95, 69, 'assets/images/products/118.jpg', FALSE, '2024-04-22 12:13:52.996000', '2024-08-21 12:13:52.999000'),
(119, 'SportDOG YardTrainer 100S Waterproof Training Dog Collar', 'Description for SportDOG YardTrainer 100S Waterproof Training Dog Collar', 'PetCo', 'J6XM160H', 1, 149.99, 81, 'assets/images/products/119.jpg', FALSE, '2024-07-01 12:13:52.996000', '2024-03-23 12:13:52.999000'),
(120, 'SportDOG YardTrainer 100 Waterproof Training Dog Collar', 'Description for SportDOG YardTrainer 100 Waterproof Training Dog Collar', 'HappyPaws', 'VEJ0XLNP', 1, 142.64, 34, 'assets/images/products/120.jpg', FALSE, '2024-01-08 12:13:52.996000', '2024-08-31 12:13:52.999000'),
(121, 'Frisco Reflective Rope Slip Lead Dog Leash', 'Description for Frisco Reflective Rope Slip Lead Dog Leash', 'FurEver', '0E8UINT0', 1, 17.54, 73, 'assets/images/products/121.jpg', TRUE, '2024-07-18 12:13:52.996000', '2024-03-01 12:13:52.999000'),
(122, 'Frisco Fashion Collar, Tropical Floral, LG - Neck: 18-26 in, Width: 1-in', 'Description for Frisco Fashion Collar, Tropical Floral, LG - Neck: 18-26 in, Width: 1-in', 'PurrBrands', '8M6OQBMT', 1, 17.76, 79, 'assets/images/products/122.jpg', FALSE, '2024-03-09 12:13:52.996000', '2024-01-31 12:13:52.999000'),
(123, 'PetSafe Rechargeable Spray Bark Control Dog Collar', 'Description for PetSafe Rechargeable Spray Bark Control Dog Collar', 'PurrBrands', 'THTUN690', 1, 107.95, 70, 'assets/images/products/123.jpg', TRUE, '2024-02-21 12:13:52.996000', '2024-02-29 12:13:52.999000'),
(124, 'Frisco Reflective Rope Dog Leash, 6-ft long', 'Description for Frisco Reflective Rope Dog Leash, 6-ft long', 'FurEver', 'ATFP4SVC', 1, 17.53, 88, 'assets/images/products/124.jpg', FALSE, '2024-07-09 12:13:52.996000', '2024-11-21 12:13:52.999000'),
(125, 'Flexi Classic Nylon Cord Retractable Dog Leash, Black, Medium: 8-m long', 'Description for Flexi Classic Nylon Cord Retractable Dog Leash, Black, Medium: 8-m long', 'HappyPaws', '096PJCA9', 1, 34.99, 78, 'assets/images/products/125.jpg', FALSE, '2024-04-13 12:13:52.996000', '2024-01-19 12:13:52.999000'),
(126, 'Frisco Traffic Leash with Padded Handles &amp; Poop Bag Dispenser, Width: 1-in, Length: 6-ft, Black', 'Description for Frisco Traffic Leash with Padded Handles &amp; Poop Bag Dispenser, Width: 1-in, Length: 6-ft, Black', 'FurEver', 'T8NNKW1D', 1, 14.79, 34, 'assets/images/products/126.jpg', TRUE, '2024-05-26 12:13:52.996000', '2024-10-23 12:13:52.999000'),
(127, 'SportDOG NoBark SBC-R Waterproof Rechargeable Training Dog Collar', 'Description for SportDOG NoBark SBC-R Waterproof Rechargeable Training Dog Collar', 'HappyPaws', '0RT7W9NM', 1, 144.99, 76, 'assets/images/products/127.jpg', FALSE, '2024-10-10 12:13:52.996000', '2023-12-19 12:13:52.999000'),
(128, 'Frisco Rope Dog Leash with Padded Handle, 5-ft long, Blue', 'Description for Frisco Rope Dog Leash with Padded Handle, 5-ft long, Blue', 'HappyPaws', 'JL6AQERA', 1, 14.18, 70, 'assets/images/products/128.jpg', FALSE, '2023-12-28 12:13:52.996000', '2024-05-13 12:13:52.999000'),
(129, 'SportDOG NoBark 10 Standard Waterproof Rechargeable Dog Bark Collar', 'Description for SportDOG NoBark 10 Standard Waterproof Rechargeable Dog Bark Collar', 'PawsInc', '3ZA8D2BC', 1, 171.99, 27, 'assets/images/products/129.jpg', FALSE, '2024-12-14 12:13:52.996000', '2024-03-27 12:13:52.999000'),
(130, 'Frisco Colorful Springs Cat Toy, 10 count', 'Description for Frisco Colorful Springs Cat Toy, 10 count', 'PurrBrands', '10T5ROU4', 2, 4.64, 58, 'assets/images/products/130.jpg', FALSE, '2024-06-30 12:13:52.996000', '2024-08-28 12:13:52.999000'),
(131, 'Frisco Bird with Feathers Teaser Wand Cat Toy with Catnip, Purple', 'Description for Frisco Bird with Feathers Teaser Wand Cat Toy with Catnip, Purple', 'PurrBrands', '460PUX41', 2, 7.84, 15, 'assets/images/products/131.jpg', TRUE, '2024-01-29 12:13:52.996000', '2024-01-02 12:13:52.999000'),
(132, 'Petstages Crunchy Pickle Kicker Dental Cat Toy with Catnip', 'Description for Petstages Crunchy Pickle Kicker Dental Cat Toy with Catnip', 'FurEver', 'AY4M5JLS', 2, 9.99, 57, 'assets/images/products/132.jpg', FALSE, '2024-07-03 12:13:52.996000', '2024-01-25 12:13:52.999000'),
(133, 'Catstages Fresh Breath Mint Stick Cat Chew Toy', 'Description for Catstages Fresh Breath Mint Stick Cat Chew Toy', 'HappyPaws', 'TUAABKUS', 2, 5.99, 60, 'assets/images/products/133.jpg', FALSE, '2024-04-03 12:13:52.996000', '2024-08-12 12:13:52.999000'),
(134, 'Frisco Step-In Cat Scratcher Toy with Catnip, Galaxy', 'Description for Frisco Step-In Cat Scratcher Toy with Catnip, Galaxy', 'FurEver', '9FUHF24U', 2, 16.99, 50, 'assets/images/products/134.jpg', FALSE, '2024-05-20 12:13:52.996000', '2024-10-20 12:13:52.999000'),
(135, 'Frisco Butterfly Cat Tracks Cat Toy, Blue', 'Description for Frisco Butterfly Cat Tracks Cat Toy, Blue', 'PetCo', 'RZKZ3F2U', 2, 11.65, 30, 'assets/images/products/135.jpg', TRUE, '2024-03-06 12:13:52.996000', '2024-08-15 12:13:52.999000'),
(136, 'Catit Zoo Elephant 2-in-1 Scratcher Cat Toy with Catnip', 'Description for Catit Zoo Elephant 2-in-1 Scratcher Cat Toy with Catnip', 'HappyPaws', 'NZYB4JIO', 2, 49.99, 83, 'assets/images/products/136.jpg', FALSE, '2024-06-01 12:13:52.996000', '2024-05-10 12:13:52.999000'),
(137, 'Frisco Bee &amp; Leaf Cat Tracks Cat Toy with Catnip', 'Description for Frisco Bee &amp; Leaf Cat Tracks Cat Toy with Catnip', 'HappyPaws', 'NCYV0Z86', 2, 11.56, 16, 'assets/images/products/137.jpg', FALSE, '2024-11-20 12:13:52.996000', '2024-11-13 12:13:52.999000'),
(138, 'Catit Zoo Gorilla 2-in-1 Scratcher Cat Toy with Catnip', 'Description for Catit Zoo Gorilla 2-in-1 Scratcher Cat Toy with Catnip', 'PetCo', 'JVYBRI3Z', 2, 49.99, 97, 'assets/images/products/138.jpg', TRUE, '2024-10-24 12:13:52.996000', '2024-12-08 12:13:52.999000'),
(139, 'Catit Zoo Polar Bear 2-in-1 Scratcher Cat Toy with Catnip', 'Description for Catit Zoo Polar Bear 2-in-1 Scratcher Cat Toy with Catnip', 'PurrBrands', '74DLVV85', 2, 49.99, 71, 'assets/images/products/139.jpg', TRUE, '2024-05-08 12:13:52.996000', '2024-06-17 12:13:52.999000'),
(140, 'Frisco Plush, Teaser, Ball &amp; Tri-Tunnel Variety Pack Cat Toy with Catnip, 20 count, Pink', 'Description for Frisco Plush, Teaser, Ball &amp; Tri-Tunnel Variety Pack Cat Toy with Catnip, 20 count, Pink', 'PawsInc', 'N2S1J4WS', 2, 32.91, 26, 'assets/images/products/140.jpg', FALSE, '2023-12-29 12:13:52.996000', '2024-03-22 12:13:52.999000'),
(141, 'Frisco Wave Cat Scratcher Toy with Catnip, Moon &amp; Stars', 'Description for Frisco Wave Cat Scratcher Toy with Catnip, Moon &amp; Stars', 'PetCo', '3RBZ1AH9', 2, 23.02, 65, 'assets/images/products/141.jpg', TRUE, '2024-09-22 12:13:52.996000', '2024-08-04 12:13:52.999000'),
(142, 'Frisco Scratch &amp; Roll Scratcher Cat Toy with Catnip', 'Description for Frisco Scratch &amp; Roll Scratcher Cat Toy with Catnip', 'HappyPaws', 'V8O6XTW5', 2, 17.64, 26, 'assets/images/products/142.jpg', TRUE, '2024-06-21 12:13:52.996000', '2024-12-13 12:13:52.999000'),
(143, 'Frisco Squirrel Plush Cat Toy with Refillable Catnip, Brown Squirrel', 'Description for Frisco Squirrel Plush Cat Toy with Refillable Catnip, Brown Squirrel', 'PurrBrands', '55HYE2NK', 2, 6.07, 35, 'assets/images/products/143.jpg', TRUE, '2024-06-13 12:13:52.996000', '2024-01-22 12:13:52.999000'),
(144, 'Frisco Cardboard &amp; Wire Teaser Cat Toy', 'Description for Frisco Cardboard &amp; Wire Teaser Cat Toy', 'PetCo', '9DR7PO0S', 2, 4.13, 39, 'assets/images/products/144.jpg', TRUE, '2024-09-05 12:13:52.996000', '2024-02-04 12:13:52.999000'),
(145, 'Nina Ottosson by Outward Hound Rainy Day Puzzle &amp; Play Cat Toy', 'Description for Nina Ottosson by Outward Hound Rainy Day Puzzle &amp; Play Cat Toy', 'FurEver', 'AHRHWLGN', 2, 29.99, 49, 'assets/images/products/145.jpg', TRUE, '2024-01-01 12:13:52.996000', '2024-01-27 12:13:52.999000'),
(146, 'Frisco 21-in Sisal Cat Scratching Post with Toy, Gray', 'Description for Frisco 21-in Sisal Cat Scratching Post with Toy, Gray', 'FurEver', 'R05IAEW8', 2, 45.99, 37, 'assets/images/products/146.jpg', FALSE, '2024-01-30 12:13:52.996000', '2024-05-22 12:13:52.999000'),
(147, 'Frisco Plush, Teaser &amp; Ball Variety Pack Cat Toy with Catnip, 12 count', 'Description for Frisco Plush, Teaser &amp; Ball Variety Pack Cat Toy with Catnip, 12 count', 'HappyPaws', 'IVNQUKX7', 2, 6.97, 55, 'assets/images/products/147.jpg', FALSE, '2024-04-21 12:13:52.996000', '2024-07-13 12:13:52.999000'),
(148, 'Frisco Scratch &amp; Roll Scratcher Cat Toy Refills, 2-Pack', 'Description for Frisco Scratch &amp; Roll Scratcher Cat Toy Refills, 2-Pack', 'HappyPaws', 'EJHW00BZ', 2, 11.79, 60, 'assets/images/products/148.jpg', FALSE, '2024-04-19 12:13:52.996000', '2024-07-29 12:13:52.999000'),
(149, 'Catit Treat Ball Cat Toy, Blue', 'Description for Catit Treat Ball Cat Toy, Blue', 'PurrBrands', 'RUBG8EMF', 2, 7.97, 84, 'assets/images/products/149.jpg', TRUE, '2024-10-20 12:13:52.996000', '2024-04-05 12:13:52.999000'),
(150, 'Outward Hound Tail Teaser with Refill Dog &amp; Cat Teaser Toy', 'Description for Outward Hound Tail Teaser with Refill Dog &amp; Cat Teaser Toy', 'PetCo', 'R47P3KIC', 2, 29.97, 25, 'assets/images/products/150.jpg', TRUE, '2024-11-15 12:13:52.996000', '2024-01-16 12:13:52.999000'),
(151, 'Catit Play Circuit Ball Catnip Massage Cat Toy', 'Description for Catit Play Circuit Ball Catnip Massage Cat Toy', 'PetCo', 'EYMM1OYB', 2, 29.99, 59, 'assets/images/products/151.jpg', FALSE, '2024-01-30 12:13:52.996000', '2024-01-23 12:13:52.999000'),
(152, 'Frisco Sushi Plush Cat Toy with Catnip, 4 count', 'Description for Frisco Sushi Plush Cat Toy with Catnip, 4 count', 'PawsInc', 'JZV0L2K3', 2, 8.07, 74, 'assets/images/products/152.jpg', FALSE, '2024-08-03 12:13:52.996000', '2024-08-29 12:13:52.999000'),
(153, 'Nina Ottosson by Outward Hound Buggin&#x27; Out Puzzle &amp; Play Cat Toy', 'Description for Nina Ottosson by Outward Hound Buggin&#x27; Out Puzzle &amp; Play Cat Toy', 'PurrBrands', '7YR7XMQA', 2, 24.99, 99, 'assets/images/products/153.jpg', TRUE, '2024-06-01 12:13:52.996000', '2024-01-15 12:13:52.999000'),
(154, 'Catit Style Jungle Stripes Patterned Scratcher Cat Toy with Catnip', 'Description for Catit Style Jungle Stripes Patterned Scratcher Cat Toy with Catnip', 'FurEver', 'WRWJGLPF', 2, 14.97, 85, 'assets/images/products/154.jpg', TRUE, '2024-06-17 12:13:52.996000', '2024-04-09 12:13:52.999000'),
(155, 'Catstages Scratch &amp; Groom Scratch Pad &amp; Grooming Brush Cat Toy', 'Description for Catstages Scratch &amp; Groom Scratch Pad &amp; Grooming Brush Cat Toy', 'FurEver', '69SI52NL', 2, 27.99, 23, 'assets/images/products/155.jpg', FALSE, '2024-11-12 12:13:52.996000', '2024-09-10 12:13:53'),
(156, 'Frisco Wave Cat Scratcher Toy with Catnip, Tropical Paradise', 'Description for Frisco Wave Cat Scratcher Toy with Catnip, Tropical Paradise', 'PawsInc', 'GN6GLXWV', 2, 17.67, 12, 'assets/images/products/156.jpg', TRUE, '2024-07-01 12:13:52.996000', '2024-07-20 12:13:53'),
(157, 'Frisco Fabric Teaser Wand Cat Toy, Neon Bubbles', 'Description for Frisco Fabric Teaser Wand Cat Toy, Neon Bubbles', 'FurEver', 'YGQYSN61', 2, 9.58, 84, 'assets/images/products/157.jpg', FALSE, '2024-06-28 12:13:52.996000', '2024-04-21 12:13:53'),
(158, 'Catstages Dental Shrimpies Cat Chew Toy with Catnip, 2 count', 'Description for Catstages Dental Shrimpies Cat Chew Toy with Catnip, 2 count', 'FurEver', 'KS0W15VJ', 2, 6.99, 15, 'assets/images/products/158.jpg', TRUE, '2024-06-14 12:13:52.996000', '2024-09-29 12:13:53'),
(159, 'Frisco Holiday Springs Cat Toy, 10 count', 'Description for Frisco Holiday Springs Cat Toy, 10 count', 'HappyPaws', '9LJFBVXN', 2, 13.99, 42, 'assets/images/products/159.jpg', TRUE, '2023-12-25 12:13:52.996000', '2024-04-15 12:13:53'),
(160, 'Catit Fish Dinner with Tuna &amp; Carrot Wet Cat Food, 80-g pouch', 'Description for Catit Fish Dinner with Tuna &amp; Carrot Wet Cat Food, 80-g pouch', 'PetCo', '1V4HUEV3', 2, 2.29, 40, 'assets/images/products/160.jpg', TRUE, '2024-08-10 12:13:52.996000', '2024-11-26 12:13:53'),
(161, 'Meow Mix Original Choice Dry Cat Food, 7.25-kg bag', 'Description for Meow Mix Original Choice Dry Cat Food, 7.25-kg bag', 'PetCo', 'ZZJGVW87', 2, 24.98, 10, 'assets/images/products/161.jpg', FALSE, '2024-08-10 12:13:52.996000', '2024-10-22 12:13:53'),
(162, 'Cat Chow Complete with Real Chicken Dry Cat Food, 4-kg bag', 'Description for Cat Chow Complete with Real Chicken Dry Cat Food, 4-kg bag', 'FurEver', '8QP8EAO7', 2, 13.97, 64, 'assets/images/products/162.jpg', TRUE, '2024-09-16 12:13:52.996000', '2024-11-01 12:13:53'),
(163, 'Iams Proactive Health Indoor Weight &amp; Hairball Care with Chicken &amp; Turkey Dry Cat Food, 7.26-kg bag', 'Description for Iams Proactive Health Indoor Weight &amp; Hairball Care with Chicken &amp; Turkey Dry Cat Food, 7.26-kg bag', 'FurEver', 'OWIHPQ23', 2, 35.99, 60, 'assets/images/products/163.jpg', TRUE, '2024-07-28 12:13:52.996000', '2024-05-22 12:13:53'),
(164, 'Sheba Bistro Perfect Portions Variety Pack Adult Grain-Free Salmon &amp; Chicken, Savoury Salmon &amp; Tuna, Signature Seafood Pate Wet Cat Food, 75-g tray, case of 24', 'Description for Sheba Bistro Perfect Portions Variety Pack Adult Grain-Free Salmon &amp; Chicken, Savoury Salmon &amp; Tuna, Signature Seafood Pate Wet Cat Food, 75-g tray, case of 24', 'HappyPaws', 'YKWH2Q9T', 2, 29.98, 60, 'assets/images/products/164.jpg', TRUE, '2024-02-06 12:13:52.996000', '2024-08-24 12:13:53'),
(165, 'Cat Chow Complete with Real Chicken Dry Cat Food, 2-kg bag', 'Description for Cat Chow Complete with Real Chicken Dry Cat Food, 2-kg bag', 'FurEver', 'FX5WCN1Q', 2, 6.97, 94, 'assets/images/products/165.jpg', TRUE, '2024-05-16 12:13:52.996000', '2024-10-05 12:13:53'),
(166, 'Friskies Chicken Lovers Variety Pack Wet Cat Food, 156-g can, case of 24', 'Description for Friskies Chicken Lovers Variety Pack Wet Cat Food, 156-g can, case of 24', 'HappyPaws', 'YPUOGL8O', 2, 21.47, 90, 'assets/images/products/166.jpg', FALSE, '2024-02-18 12:13:52.996000', '2024-11-18 12:13:53'),
(167, 'Friskies Shredded Variety Pack Wet Cat Food, 156-g can, case of 32', 'Description for Friskies Shredded Variety Pack Wet Cat Food, 156-g can, case of 32', 'PetCo', 'QKIISONX', 2, 28.77, 41, 'assets/images/products/167.jpg', TRUE, '2024-05-04 12:13:52.996000', '2024-11-06 12:13:53'),
(168, 'Friskies Pate Ocean Delights Variety Pack Wet Cat Food, 156-g, case of 24', 'Description for Friskies Pate Ocean Delights Variety Pack Wet Cat Food, 156-g, case of 24', 'HappyPaws', 'DXQSJLPA', 2, 21.47, 42, 'assets/images/products/168.jpg', TRUE, '2024-04-22 12:13:52.996000', '2024-03-31 12:13:53'),
(169, 'Friskies Poultry Variety Pack Wet Cat Food, 156-g can, case of 32', 'Description for Friskies Poultry Variety Pack Wet Cat Food, 156-g can, case of 32', 'FurEver', 'SK1G3KPR', 2, 28.77, 36, 'assets/images/products/169.jpg', TRUE, '2024-11-29 12:13:52.996000', '2024-08-22 12:13:53'),
(170, 'Cat Chow Complete Real Salmon Dry Cat Food, 6.4-kg bag', 'Description for Cat Chow Complete Real Salmon Dry Cat Food, 6.4-kg bag', 'FurEver', 'G4SNXD1D', 2, 21.97, 72, 'assets/images/products/170.jpg', FALSE, '2024-01-30 12:13:52.996000', '2024-09-03 12:13:53'),
(171, 'Hill&#x27;s Science Diet Adult Sensitive Stomach &amp; Sensitive Skin Chicken &amp; Rice Recipe Dry Cat Food, 7.03-kg bag', 'Description for Hill&#x27;s Science Diet Adult Sensitive Stomach &amp; Sensitive Skin Chicken &amp; Rice Recipe Dry Cat Food, 7.03-kg bag', 'FurEver', 'MX3SUT2Q', 2, 98.99, 18, 'assets/images/products/171.jpg', TRUE, '2024-02-17 12:13:52.996000', '2024-02-14 12:13:53'),
(172, 'Friskies Lil’ Soups with Chicken &amp; Butternut Squash in a Velvety Broth Cat Food Complement, 34-g tray, case of 8', 'Description for Friskies Lil’ Soups with Chicken &amp; Butternut Squash in a Velvety Broth Cat Food Complement, 34-g tray, case of 8', 'PawsInc', '9NBZAV5B', 2, 9.36, 58, 'assets/images/products/172.jpg', FALSE, '2024-11-19 12:13:52.996000', '2024-12-08 12:13:53'),
(173, 'Hill&#x27;s Science Diet Adult Perfect Weight Chicken Recipe Dry Cat Food, 6.80-kg bag', 'Description for Hill&#x27;s Science Diet Adult Perfect Weight Chicken Recipe Dry Cat Food, 6.80-kg bag', 'PurrBrands', 'SYO2W09F', 2, 94.99, 83, 'assets/images/products/173.jpg', TRUE, '2024-05-13 12:13:52.996000', '2024-01-29 12:13:53'),
(174, 'Hill&#x27;s Science Diet Adult Healthy Cuisine Roasted Chicken &amp; Rice Medley Canned Cat Food, 79-g, case of 24', 'Description for Hill&#x27;s Science Diet Adult Healthy Cuisine Roasted Chicken &amp; Rice Medley Canned Cat Food, 79-g, case of 24', 'PurrBrands', 'QAXDZ4HB', 2, 61.25, 19, 'assets/images/products/174.jpg', TRUE, '2024-07-04 12:13:52.996000', '2024-05-28 12:13:53'),
(175, 'Sheba Bistro Perfect Portions Variety Pack Adult Grain-Free Chicken in Alfredo Sauce &amp; Salmon in Creamy Sauce Wet Cat Food, 75-g tray, case of 12', 'Description for Sheba Bistro Perfect Portions Variety Pack Adult Grain-Free Chicken in Alfredo Sauce &amp; Salmon in Creamy Sauce Wet Cat Food, 75-g tray, case of 12', 'PurrBrands', 'WC50I4U3', 2, 16.48, 49, 'assets/images/products/175.jpg', FALSE, '2024-08-16 12:13:52.996000', '2024-09-24 12:13:53'),
(176, 'Wellness Complete Health Pate Chicken Entree Grain-Free Natural Canned Cat Food, 354-g can, case of 12', 'Description for Wellness Complete Health Pate Chicken Entree Grain-Free Natural Canned Cat Food, 354-g can, case of 12', 'FurEver', 'TU7BUSPZ', 2, 81.48, 83, 'assets/images/products/176.jpg', FALSE, '2024-10-03 12:13:52.996000', '2024-10-20 12:13:53'),
(177, 'Friskies Lil&#x27; Soups with Flaked Chicken Cat Food Complement, 34-g tray, case of 8', 'Description for Friskies Lil&#x27; Soups with Flaked Chicken Cat Food Complement, 34-g tray, case of 8', 'PurrBrands', 'LGF9W3BV', 2, 9.36, 54, 'assets/images/products/177.jpg', FALSE, '2024-06-02 12:13:52.996000', '2024-11-03 12:13:53'),
(178, 'Royal Canin Feline Health Nutrition Indoor Adult Dry Cat Food, 6.81-kg bag', 'Description for Royal Canin Feline Health Nutrition Indoor Adult Dry Cat Food, 6.81-kg bag', 'HappyPaws', 'W4ZZU7HZ', 2, 101.99, 50, 'assets/images/products/178.jpg', TRUE, '2024-10-08 12:13:52.996000', '2024-09-23 12:13:53'),
(179, 'Hill&#x27;s Science Diet Adult Urinary Hairball Control Savory Chicken Entree Canned Cat Food, 156-g can, case of 24', 'Description for Hill&#x27;s Science Diet Adult Urinary Hairball Control Savory Chicken Entree Canned Cat Food, 156-g can, case of 24', 'HappyPaws', '9W38Q92J', 2, 72.77, 59, 'assets/images/products/179.jpg', FALSE, '2024-02-15 12:13:52.996000', '2024-05-11 12:13:53'),
(180, 'Purina Pro Plan Specialized Urinary Tract Health Chicken Entree Wet Cat Food, 85-g can, case of 24', 'Description for Purina Pro Plan Specialized Urinary Tract Health Chicken Entree Wet Cat Food, 85-g can, case of 24', 'PetCo', 'EXQE444U', 2, 59.76, 85, 'assets/images/products/180.jpg', TRUE, '2024-01-17 12:13:52.996000', '2024-05-05 12:13:53'),
(181, 'Friskies Greatest Hits Variety Pack Wet Cat Food, 156-g, case of 32', 'Description for Friskies Greatest Hits Variety Pack Wet Cat Food, 156-g, case of 32', 'PetCo', 'U7CD1QLZ', 2, 28.77, 78, 'assets/images/products/181.jpg', TRUE, '2024-07-29 12:13:52.996000', '2024-05-20 12:13:53'),
(182, 'Friskies Seafood &amp; Chicken Lovers Variety Pack Wet Cat Food, 156-g can, case of 24', 'Description for Friskies Seafood &amp; Chicken Lovers Variety Pack Wet Cat Food, 156-g can, case of 24', 'PawsInc', 'YHTMZN5N', 2, 21.47, 37, 'assets/images/products/182.jpg', TRUE, '2024-06-29 12:13:52.996000', '2024-04-18 12:13:53'),
(183, 'Fancy Feast Classic Broths Collection Variety Pack Cat Food Complement, 40-g pouch, case of 12', 'Description for Fancy Feast Classic Broths Collection Variety Pack Cat Food Complement, 40-g pouch, case of 12', 'PawsInc', 'OPA7XAEV', 2, 14.78, 90, 'assets/images/products/183.jpg', FALSE, '2024-02-03 12:13:52.996000', '2023-12-31 12:13:53'),
(184, 'Purina Pro Plan Complete Essentials White Meat Chicken &amp; Vegetables Entree Wet Cat Food, 85-g can, case of 24', 'Description for Purina Pro Plan Complete Essentials White Meat Chicken &amp; Vegetables Entree Wet Cat Food, 85-g can, case of 24', 'PetCo', 'HKGNUVEM', 2, 57.36, 78, 'assets/images/products/184.jpg', FALSE, '2024-01-05 12:13:52.996000', '2024-08-29 12:13:53'),
(185, 'Friskies Gravy Pleasers Variety Pack Wet Cat Food, 156-g can, case of 24', 'Description for Friskies Gravy Pleasers Variety Pack Wet Cat Food, 156-g can, case of 24', 'PurrBrands', 'G79N9SFB', 2, 21.47, 21, 'assets/images/products/185.jpg', TRUE, '2024-10-10 12:13:52.996000', '2024-07-07 12:13:53'),
(186, 'Royal Canin Feline Care Nutrition Digestive Care Dry Cat Food, 6.36-kg bag', 'Description for Royal Canin Feline Care Nutrition Digestive Care Dry Cat Food, 6.36-kg bag', 'FurEver', '1E7EJA8P', 2, 105.99, 98, 'assets/images/products/186.jpg', TRUE, '2024-09-23 12:13:52.996000', '2024-01-07 12:13:53'),
(187, 'Hill&#x27;s Science Diet Adult Indoor Chicken Recipe Dry Cat Food, 7.03-kg bag', 'Description for Hill&#x27;s Science Diet Adult Indoor Chicken Recipe Dry Cat Food, 7.03-kg bag', 'PetCo', '0PTQWMBL', 2, 92.04, 97, 'assets/images/products/187.jpg', TRUE, '2023-12-20 12:13:52.996000', '2024-07-16 12:13:53'),
(188, 'Fancy Feast Creamy Broths Collection Variety Pack Cat Food Complement, 40-g pouch, case of 12', 'Description for Fancy Feast Creamy Broths Collection Variety Pack Cat Food Complement, 40-g pouch, case of 12', 'PawsInc', 'NIAQ4V1X', 2, 14.78, 26, 'assets/images/products/188.jpg', TRUE, '2024-12-08 12:13:52.996000', '2024-10-24 12:13:53'),
(189, 'Reveal Natural Grain-Free Variety of Fish in Broth Flavored Wet Cat Food, 2.47-oz can, case of 12', 'Description for Reveal Natural Grain-Free Variety of Fish in Broth Flavored Wet Cat Food, 2.47-oz can, case of 12', 'HappyPaws', 'KR6IEBYR', 2, 23.99, 19, 'assets/images/products/189.jpg', FALSE, '2024-02-19 12:13:52.996000', '2024-02-11 12:13:53'),
(190, 'Hill&#x27;s Science Diet Adult Perfect Weight Roasted Vegetable &amp; Chicken Medley Canned Cat Food, 82-g, case of 24', 'Description for Hill&#x27;s Science Diet Adult Perfect Weight Roasted Vegetable &amp; Chicken Medley Canned Cat Food, 82-g, case of 24', 'FurEver', 'SU77L6FH', 2, 57.36, 73, 'assets/images/products/190.jpg', FALSE, '2024-07-26 12:13:52.996000', '2024-07-11 12:13:53'),
(191, 'Iams Perfect Portions Variety Pack Adult Grain-Free Chicken &amp; Tuna Pate Wet Cat Food, 75-g tray, case of 12', 'Description for Iams Perfect Portions Variety Pack Adult Grain-Free Chicken &amp; Tuna Pate Wet Cat Food, 75-g tray, case of 12', 'HappyPaws', 'MGW2XY75', 2, 18.99, 19, 'assets/images/products/191.jpg', FALSE, '2024-10-31 12:13:52.996000', '2024-11-08 12:13:53'),
(192, 'Friskies Turkey Experience Variety Pack Wet Cat Food, 156-g, case of 32', 'Description for Friskies Turkey Experience Variety Pack Wet Cat Food, 156-g, case of 32', 'PawsInc', '9WQKXGAI', 2, 28.77, 95, 'assets/images/products/192.jpg', TRUE, '2024-09-22 12:13:52.996000', '2024-01-27 12:13:53'),
(193, 'Whiskas Meaty Selections Variety Pack Chicken &amp; Tender Beef Dinner Pate Wet Cat Food, 100-g tray, case of 12', 'Description for Whiskas Meaty Selections Variety Pack Chicken &amp; Tender Beef Dinner Pate Wet Cat Food, 100-g tray, case of 12', 'PurrBrands', 'EZBHQMO8', 2, 14.99, 84, 'assets/images/products/193.jpg', FALSE, '2024-08-12 12:13:52.996000', '2024-01-18 12:13:53'),
(194, 'Royal Canin Feline Health Nutrition Kitten Thin Slices in Gravy Canned Cat Food, 85-g can, case of 12', 'Description for Royal Canin Feline Health Nutrition Kitten Thin Slices in Gravy Canned Cat Food, 85-g can, case of 12', 'PetCo', 'MK0UKPU3', 2, 34.99, 82, 'assets/images/products/194.jpg', TRUE, '2024-10-18 12:13:52.996000', '2024-11-04 12:13:53'),
(195, 'Whiskas Perfect Portions Meaty Selections Pate Wet Cat Food, 75-g tray, case of 12', 'Description for Whiskas Perfect Portions Meaty Selections Pate Wet Cat Food, 75-g tray, case of 12', 'FurEver', 'Z2VPKWC7', 2, 14.39, 95, 'assets/images/products/195.jpg', FALSE, '2024-07-19 12:13:52.996000', '2024-07-11 12:13:53'),
(196, 'More Birds Wild Bird Feeder Cleaning Brush Kit', 'Description for More Birds Wild Bird Feeder Cleaning Brush Kit', 'FurEver', '1EWOXY94', 3, 16.99, 91, 'assets/images/products/196.jpg', FALSE, '2024-10-20 12:13:52.996000', '2024-09-21 12:13:53'),
(197, 'More Birds Lantern Seed Wild Bird Feeder, Small', 'Description for More Birds Lantern Seed Wild Bird Feeder, Small', 'PurrBrands', '6XD5GRER', 3, 14.98, 40, 'assets/images/products/197.jpg', FALSE, '2024-05-22 12:13:52.996000', '2024-08-25 12:13:53'),
(198, 'Perky Pet Wild Bird Feeder Hanging Chain', 'Description for Perky Pet Wild Bird Feeder Hanging Chain', 'HappyPaws', '3TVAF6G6', 3, 3.59, 76, 'assets/images/products/198.jpg', FALSE, '2024-07-14 12:13:52.996000', '2024-03-08 12:13:53'),
(199, 'More Birds Seed Jumbo Tube Wild Bird Feeder', 'Description for More Birds Seed Jumbo Tube Wild Bird Feeder', 'HappyPaws', 'MN5BNW9A', 3, 34.99, 15, 'assets/images/products/199.jpg', TRUE, '2024-09-06 12:13:52.996000', '2024-03-21 12:13:53'),
(200, 'Perky Pet Squirrel Stumper Seed Wild Bird Feeder', 'Description for Perky Pet Squirrel Stumper Seed Wild Bird Feeder', 'FurEver', 'DXGB7AUD', 3, 25.99, 58, 'assets/images/products/200.jpg', FALSE, '2024-09-04 12:13:52.996000', '2023-12-19 12:13:53'),
(201, 'More Birds Colbalt Twin Combo Screen Wild Bird Feeder', 'Description for More Birds Colbalt Twin Combo Screen Wild Bird Feeder', 'PurrBrands', 'DLVQWAVA', 3, 73.99, 70, 'assets/images/products/201.jpg', FALSE, '2024-06-06 12:13:52.996000', '2024-08-27 12:13:53'),
(202, 'More Birds Thistle Tube Wild Bird Feeder', 'Description for More Birds Thistle Tube Wild Bird Feeder', 'HappyPaws', 'LJOXCGI2', 3, 16.99, 90, 'assets/images/products/202.jpg', FALSE, '2023-12-31 12:13:52.996000', '2024-08-30 12:13:53'),
(203, 'More Birds Cage Single Suet Cake Weather Guard Roof Wild Bird Feeder', 'Description for More Birds Cage Single Suet Cake Weather Guard Roof Wild Bird Feeder', 'FurEver', 'WKV7MDGL', 3, 15.99, 28, 'assets/images/products/203.jpg', FALSE, '2024-11-15 12:13:52.996000', '2024-07-10 12:13:53'),
(204, 'Perky Pet Sunflower Screen Wild Bird Feeder', 'Description for Perky Pet Sunflower Screen Wild Bird Feeder', 'PetCo', '6K5ZL1TE', 3, 58.74, 34, 'assets/images/products/204.jpg', TRUE, '2024-09-29 12:13:52.996000', '2024-01-29 12:13:53'),
(205, 'Perky Pet Finch Screen Wild Bird Feeder', 'Description for Perky Pet Finch Screen Wild Bird Feeder', 'PetCo', 'C4TDGCCO', 3, 53.76, 90, 'assets/images/products/205.jpg', FALSE, '2024-09-07 12:13:52.996000', '2024-04-10 12:13:53'),
(206, 'Perky Pet White Farmhouse Seed Wild Bird Feeder', 'Description for Perky Pet White Farmhouse Seed Wild Bird Feeder', 'PawsInc', 'UMN5CF6N', 3, 44.39, 10, 'assets/images/products/206.jpg', FALSE, '2024-02-22 12:13:52.996000', '2024-04-03 12:13:53'),
(207, 'Perky Pet Seed Ball Screen Wild Bird Feeder', 'Description for Perky Pet Seed Ball Screen Wild Bird Feeder', 'FurEver', 'BOK4XSDU', 3, 17.49, 33, 'assets/images/products/207.jpg', TRUE, '2024-02-07 12:13:52.996000', '2024-10-29 12:13:53'),
(208, 'More Birds Cage Double Suet Cake Weather Guard Roof Wild Bird Feeder', 'Description for More Birds Cage Double Suet Cake Weather Guard Roof Wild Bird Feeder', 'PetCo', 'CLMDS4NQ', 3, 10.98, 77, 'assets/images/products/208.jpg', FALSE, '2024-11-20 12:13:52.996000', '2024-08-07 12:13:53'),
(209, 'Armstrong Birder&#x27;s Choice Suet Cake Wild Bird Food, 320-g', 'Description for Armstrong Birder&#x27;s Choice Suet Cake Wild Bird Food, 320-g', 'PawsInc', 'RVVE79EG', 3, 3.49, 65, 'assets/images/products/209.jpg', FALSE, '2024-11-05 12:13:52.996000', '2024-07-26 12:13:53'),
(210, 'Perky Pet Copper Panorama Seed Wild Bird Feeder', 'Description for Perky Pet Copper Panorama Seed Wild Bird Feeder', 'FurEver', 'GA8Y8Q8I', 3, 44.99, 78, 'assets/images/products/210.jpg', TRUE, '2024-10-22 12:13:52.996000', '2024-11-20 12:13:53'),
(211, 'Armstrong Four Seasons Suet Cake Wild Bird Food, 320-g', 'Description for Armstrong Four Seasons Suet Cake Wild Bird Food, 320-g', 'HappyPaws', 'IVFDCK45', 3, 3.49, 45, 'assets/images/products/211.jpg', TRUE, '2024-08-15 12:13:52.996000', '2024-02-08 12:13:53'),
(212, 'Armstrong Black Oil Unshelled Sunflower Chips Wild Bird Food, 1.8-kg bag', 'Description for Armstrong Black Oil Unshelled Sunflower Chips Wild Bird Food, 1.8-kg bag', 'HappyPaws', '2WW9BZBU', 3, 21.99, 19, 'assets/images/products/212.jpg', TRUE, '2023-12-20 12:13:52.996000', '2024-09-20 12:13:53'),
(213, 'Armstrong Safflower Wild Bird Food, 1.8-kg bag', 'Description for Armstrong Safflower Wild Bird Food, 1.8-kg bag', 'PawsInc', '7PJ1TSAL', 3, 14.99, 57, 'assets/images/products/213.jpg', FALSE, '2023-12-19 12:13:52.996000', '2024-12-16 12:13:53'),
(214, 'Armstrong Peanut Select Suet Cake Wild Bird Food, 320-g', 'Description for Armstrong Peanut Select Suet Cake Wild Bird Food, 320-g', 'HappyPaws', 'LQPBYLHH', 3, 3.49, 32, 'assets/images/products/214.jpg', FALSE, '2024-04-11 12:13:52.996000', '2024-10-27 12:13:53'),
(215, 'More Birds Double Hanger Wild Bird Feeder Pole, 78-inch', 'Description for More Birds Double Hanger Wild Bird Feeder Pole, 78-inch', 'PetCo', '55ITLUP8', 3, 66.99, 14, 'assets/images/products/215.jpg', FALSE, '2024-02-19 12:13:52.996000', '2024-02-29 12:13:53'),
(216, 'Armstrong Royal Jubilee Jay&#x27;s Blend Wild Bird Food, 7.25-kg bag', 'Description for Armstrong Royal Jubilee Jay&#x27;s Blend Wild Bird Food, 7.25-kg bag', 'HappyPaws', 'K9MCUD5F', 3, 47.99, 39, 'assets/images/products/216.jpg', TRUE, '2024-11-27 12:13:52.996000', '2024-06-15 12:13:53'),
(217, 'Armstrong Royal Jubilee Jay&#x27;s Blend Suet Cake Wild Bird Food, 900-g, 3 count', 'Description for Armstrong Royal Jubilee Jay&#x27;s Blend Suet Cake Wild Bird Food, 900-g, 3 count', 'PetCo', 'B5OL0V77', 3, 11.49, 37, 'assets/images/products/217.jpg', FALSE, '2023-12-26 12:13:52.996000', '2024-11-21 12:13:53'),
(218, 'Armstrong Favourite Finch Wild Bird Food, 4.5-kg bag', 'Description for Armstrong Favourite Finch Wild Bird Food, 4.5-kg bag', 'PetCo', 'T7AJLEO7', 3, 19.99, 23, 'assets/images/products/218.jpg', TRUE, '2024-12-13 12:13:52.996000', '2024-01-08 12:13:53'),
(219, 'Armstrong Woodpecker Suet Cake Wild Bird Food, 300-g', 'Description for Armstrong Woodpecker Suet Cake Wild Bird Food, 300-g', 'HappyPaws', 'QXJILNAM', 3, 3.49, 89, 'assets/images/products/219.jpg', FALSE, '2024-09-22 12:13:52.996000', '2024-06-13 12:13:53'),
(220, 'More Birds Wild Bird Seed Scoop', 'Description for More Birds Wild Bird Seed Scoop', 'FurEver', 'Q076L0VX', 3, 8.99, 26, 'assets/images/products/220.jpg', FALSE, '2024-01-01 12:13:52.996000', '2024-11-13 12:13:53'),
(221, 'Armstrong Peanuts-in-Shell Wild Bird Food, 1.3-kg bag', 'Description for Armstrong Peanuts-in-Shell Wild Bird Food, 1.3-kg bag', 'PurrBrands', '561VLUIT', 3, 18.99, 66, 'assets/images/products/221.jpg', FALSE, '2024-09-16 12:13:52.996000', '2024-10-20 12:13:53'),
(222, 'Armstrong Royal Jubilee Sweet Songs Wild Bird Food, 6.35-kg bag', 'Description for Armstrong Royal Jubilee Sweet Songs Wild Bird Food, 6.35-kg bag', 'PawsInc', 'QFNWF56J', 3, 45.99, 24, 'assets/images/products/222.jpg', TRUE, '2024-12-04 12:13:52.996000', '2024-07-31 12:13:53'),
(223, 'More Birds Seed Window Tube Wild Bird Feeder', 'Description for More Birds Seed Window Tube Wild Bird Feeder', 'FurEver', 'QZL05YHE', 3, 16.99, 23, 'assets/images/products/223.jpg', TRUE, '2024-11-25 12:13:52.996000', '2024-09-11 12:13:53'),
(224, 'More Birds 19&quot; Topsy Tails Finch Wild Bird Feeder', 'Description for More Birds 19&quot; Topsy Tails Finch Wild Bird Feeder', 'PetCo', 'ZKQXBXB8', 3, 33.99, 42, 'assets/images/products/224.jpg', FALSE, '2024-04-17 12:13:52.996000', '2024-05-31 12:13:53'),
(225, 'Armstrong Berry N&#x27; Nut Suet Cake Wild Bird Food, 320-g', 'Description for Armstrong Berry N&#x27; Nut Suet Cake Wild Bird Food, 320-g', 'HappyPaws', 'V6XZVXFU', 3, 3.49, 33, 'assets/images/products/225.jpg', FALSE, '2024-02-10 12:13:52.996000', '2024-11-27 12:13:53'),
(226, 'Perky Pet Wild Bird Feeder Metal Hook', 'Description for Perky Pet Wild Bird Feeder Metal Hook', 'HappyPaws', 'DUAR9PH9', 3, 9.74, 100, 'assets/images/products/226.jpg', TRUE, '2024-01-30 12:13:52.996000', '2024-01-19 12:13:53'),
(227, 'More Birds Seed Tube Wild Bird Feeder', 'Description for More Birds Seed Tube Wild Bird Feeder', 'PetCo', 'HGXG3RQ2', 3, 16.99, 93, 'assets/images/products/227.jpg', FALSE, '2024-12-06 12:13:52.996000', '2024-02-20 12:13:53'),
(228, 'Perky Pet Squirrel Be-Gone Wild Bird Feeder', 'Description for Perky Pet Squirrel Be-Gone Wild Bird Feeder', 'PawsInc', 'CELYREXX', 3, 39.98, 52, 'assets/images/products/228.jpg', TRUE, '2024-01-09 12:13:52.996000', '2024-03-16 12:13:53'),
(229, 'Armstrong Royal Jubilee Brilliance Suet Cake Wild Bird Food, 900-g, 3 count', 'Description for Armstrong Royal Jubilee Brilliance Suet Cake Wild Bird Food, 900-g, 3 count', 'FurEver', '9UBIUT7J', 3, 11.49, 11, 'assets/images/products/229.jpg', FALSE, '2024-02-15 12:13:52.996000', '2024-02-21 12:13:53'),
(230, 'Armstrong All Season Wild Bird Food, 7-kg bag', 'Description for Armstrong All Season Wild Bird Food, 7-kg bag', 'HappyPaws', 'I88TN9UE', 3, 17.99, 78, 'assets/images/products/230.jpg', FALSE, '2024-11-23 12:13:52.996000', '2024-05-24 12:13:53'),
(231, 'Armstrong Sweet Strong Wild Bird Food, 7-kg bag', 'Description for Armstrong Sweet Strong Wild Bird Food, 7-kg bag', 'PetCo', 'E927M961', 3, 17.99, 80, 'assets/images/products/231.jpg', TRUE, '2024-02-18 12:13:52.996000', '2024-07-11 12:13:53');

-- Insert data into the `wishlist` table for customers
INSERT INTO `wishlist` (`user_id`, `product_id`)
VALUES
    (1, 1), (2, 2), (3, 3);

-- Insert data into the `shopping_cart` table for customers
INSERT INTO `shopping_cart` (`user_id`, `product_id`, `quantity`)
VALUES
    (1, 1, 2), (2, 2, 1), (4, 3, 1);

-- Insert data into the `card_issuer` table

INSERT INTO `card_issuer` (`name`)
VALUES
    ('Visa'), ('MasterCard'), ('American Express');

-- Insert data into the `payment_type` table
INSERT INTO `payment_type` (`type`, `card_issuer_id`)
VALUES
    ('credit', 1), ('debit', 2), ('credit', 3);

INSERT INTO `user_address` (`user_id`, `street`, `complement`, `city`, `province`, `country`, `postal_code`, `is_default`)
VALUES
(1, '123 Main St', 'Apt 1023', 'Toronto', 'Ontario', 'Canada', 'M1M 1M1', TRUE),
(2, '456 Oak St', 'Apt 101', 'Vancouver', 'British Columbia', 'Canada', 'V2V 2V2', TRUE),
(3, '789 Elm St', 'Suite 202', 'Montreal', 'Quebec', 'Canada', 'Q3Q 3Q3', TRUE),
(2, '456 Oak St', 'Apt 1', 'Vancouver', 'British Columbia', 'Canada', 'V2V 2V2', FALSE),
(3, '789 Elm St', 'Apt 2', 'Montreal', 'Quebec', 'Canada', 'Q3Q 3Q3', FALSE),
(4, '101 Birch St', 'Unit 10', 'Calgary', 'Alberta', 'Canada', 'T2E 1A6', TRUE),
(5, '202 Maple St', 'Floor 3', 'Winnipeg', 'Manitoba', 'Canada', 'R2C 0A1', TRUE),
(6, '303 Cedar St', '', 'Halifax', 'Nova Scotia', 'Canada', 'B3H 1A1', TRUE),
(7, '404 Spruce St', 'Suite 15', 'St. John’s', 'Newfoundland', 'Canada', 'A1C 5M1', TRUE),
(8, '505 Willow St', '', 'Regina', 'Saskatchewan', 'Canada', 'S4P 3Y1', TRUE),
(9, '606 Elm St', 'Apt 2B', 'Iqaluit', 'Nunavut', 'Canada', 'X0A 0H0', TRUE),
(10, '707 Ash St', '', 'Whitehorse', 'Yukon', 'Canada', 'Y1A 1B7', TRUE),
(4, '101 Birch St', 'Unit 11', 'Calgary', 'Alberta', 'Canada', 'T2E 1A6', FALSE),
(5, '202 Maple St', 'Floor 4', 'Winnipeg', 'Manitoba', 'Canada', 'R2C 0A1', FALSE),
(6, '303 Cedar St', 'Rear Unit', 'Halifax', 'Nova Scotia', 'Canada', 'B3H 1A1', FALSE),
(7, '404 Spruce St', 'Suite 20', 'St. John’s', 'Newfoundland', 'Canada', 'A1C 5M1', FALSE),
(8, '505 Willow St', 'Ground Floor', 'Regina', 'Saskatchewan', 'Canada', 'S4P 3Y1', FALSE),
(9, '606 Elm St', 'Apt 3A', 'Iqaluit', 'Nunavut', 'Canada', 'X0A 0H0', FALSE),
(10, '707 Ash St', 'Upper Floor', 'Whitehorse', 'Yukon', 'Canada', 'Y1A 1B7', FALSE),
(1, '101 Birch St', 'Unit 12', 'Calgary', 'Alberta', 'Canada', 'T2E 1A6', TRUE),
(2, '202 Maple St', 'Floor 2', 'Winnipeg', 'Manitoba', 'Canada', 'R2C 0A1', TRUE),
(3, '303 Cedar St', 'Suite 1', 'Halifax', 'Nova Scotia', 'Canada', 'B3H 1A1', TRUE),
(4, '404 Spruce St', 'Apt 10', 'St. John’s', 'Newfoundland', 'Canada', 'A1C 5M1', TRUE),
(5, '505 Willow St', 'Unit 1', 'Regina', 'Saskatchewan', 'Canada', 'S4P 3Y1', TRUE),
(6, '606 Elm St', 'Floor 1', 'Iqaluit', 'Nunavut', 'Canada', 'X0A 0H0', TRUE),
(7, '707 Ash St', 'Suite 5', 'Whitehorse', 'Yukon', 'Canada', 'Y1A 1B7', TRUE),
(8, '101 Birch St', 'Unit 13', 'Calgary', 'Alberta', 'Canada', 'T2E 1A6', FALSE),
(9, '202 Maple St', 'Floor 1', 'Winnipeg', 'Manitoba', 'Canada', 'R2C 0A1', FALSE),
(10, '303 Cedar St', 'Suite 2', 'Halifax', 'Nova Scotia', 'Canada', 'B3H 1A1', FALSE),
(4, '404 Spruce St', 'Apt 11', 'St. John’s', 'Newfoundland', 'Canada', 'A1C 5M1', FALSE),
(5, '505 Willow St', 'Unit 2', 'Regina', 'Saskatchewan', 'Canada', 'S4P 3Y1', FALSE),
(6, '606 Elm St', 'Floor 2', 'Iqaluit', 'Nunavut', 'Canada', 'X0A 0H0', FALSE),
(7, '707 Ash St', 'Suite 6', 'Whitehorse', 'Yukon', 'Canada', 'Y1A 1B7', FALSE),
(1, '101 Birch St', 'Unit 14', 'Calgary', 'Alberta', 'Canada', 'T2E 1A6', TRUE),
(11, '101 St St', 'Unit 1', 'Calgary', 'Alberta', 'Canada', 'T2E 1A6', TRUE),
(12, '202 St St', 'Floor 2', 'Winnipeg', 'Manitoba', 'Canada', 'R2C 0A1', TRUE),
(13, '303 St St', 'Suite 1', 'Halifax', 'Nova Scotia', 'Canada', 'B3H 1A1', TRUE);


INSERT INTO `user_payment_info` (`user_id`, `payment_type_id`, `card_number`, `expiry_date`, `cvv`, `is_default`) VALUES
(1, 2, '9876 5432 9876 5432', '02/23', '456', TRUE),
(2, 2, '9876 5432 9876 5432', '02/23', '456', TRUE),
(3, 3, '2468 1357 2468 1357', '01/29', '789', TRUE),
(2, 1, '1234 5678 1234 5678', '12/25', '123', FALSE),
(3, 2, '9876 5432 9876 5432', '02/22', '456', FALSE),
(4, 1, '4111 1111 1111 1111', '03/26', '111', TRUE),
(5, 2, '5500 0000 0000 0004', '05/28', '222', FALSE),
(6, 3, '3400 0000 0000 009', '10/27', '333', TRUE),
(4, 2, '6011 1111 1111 1117', '07/25', '444', FALSE),
(5, 1, '4111 2222 3333 4444', '12/29', '555', TRUE),
(6, 2, '5500 2222 3333 4444', '02/30', '666', FALSE),
(7, 3, '3000 0000 0000 04', '08/26', '777', TRUE),
(8, 1, '3530 1113 3330 0000', '04/27', '888', TRUE),
(9, 2, '6011 4444 5555 6666', '01/28', '999', FALSE),
(10, 3, '4111 5555 6666 7777', '09/26', '101', TRUE),
(11, 1, '3530 1113 3330 0000', '04/27', '101', TRUE),
(12, 2, '6011 4444 5555 6666', '01/28', '202', FALSE),
(13, 3, '4111 5555 6666 7777', '09/26', '303', TRUE);


-- Insert data into the `order` table
INSERT INTO `order` (`user_id`, `total_price`, `user_payment_id`, `shipping_address_id`, `billing_address_id`)
VALUES
    (1, 51.98, 1, 1, 1),
    (2, 4.99, 2, 2, 2);

-- Insert data into the `order_items` table
INSERT INTO `order_items` (`order_id`, `product_id`, `quantity`)
VALUES
    (1, 1, 2), (2, 2, 1);

-- Insert data into the `review` table
INSERT INTO `review` (`user_id`, `product_id`, `rating`, `comment`)
VALUES
    (1, 1, 5, 'Great product, my dog loves it!'),
    (2, 2, 4, 'Fun toy, but not very durable.');

-- -- SELECT: View all `product`
-- SELECT * FROM `product`;

-- -- UPDATE: Update the `quantity` of a `product`
-- UPDATE `product`
-- SET `quantity` = 90
-- WHERE `product_id` = 1;

-- -- DELETE: Remove an item from the `shopping_cart`
-- DELETE FROM `shopping_cart`
-- WHERE `cart_id` = 1;

-- -- SELECT: View all `order` for a specific `user`
-- SELECT * FROM `order`
-- WHERE `user_id` = 1;

-- -- DELETE: Delete a `user` (cascade will affect related data like `order`)
-- DELETE FROM `user`
-- WHERE `email` = 'george.y@example.com';

-- -- INSERT: Add a new `category`
-- INSERT INTO `category` (`name`, `description`)
-- VALUES ('Fish Supplies', 'product for fish tanks and accessories');

-- -- SELECT: View all `category`
-- SELECT * FROM `category`;
