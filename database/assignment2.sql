--Adding Tony Stark to the 'account' table--
INSERT INTO public.account(account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

--Set Tony Stark as Admin--
UPDATE public.account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

--Delte Tony Stark from the Database--
DELETE FROM account
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

--Modify the "GM Hummer" description record to read "a huge interior"--
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

--Inner join to select make, models from inventory and classification_name from clasification--
--that belongs to the 'Sport' category--
SELECT i.inv_make, i.inv_model, c.classification_name
FROM inventory i
INNER JOIN classification c
	ON i.classification_id = c.classification_id
WHERE c.classification_name = 'sport';

--Update all records in the inventory table to add "/vehicles" --
--to the middle of the file path in the inv_image and inv_thumbnail --
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/','/images/vehicles/'), 
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/','/images/vehicles/');