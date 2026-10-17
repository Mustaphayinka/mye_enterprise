-- Starter data: the 41 products from the old site. Run AFTER schema.sql, once.
-- Images point to /images/... - copy the old site's images/ folder into public/images/,
-- or replace the photos from the admin page.

insert into categories (name, slug, sort_order) values
  ('Kitchen & Dining', 'kitchen-dining', 0),
  ('Home & Storage', 'home-storage', 1),
  ('Beauty & Personal Care', 'beauty-personal-care', 2),
  ('Gadgets & Accessories', 'gadgets-accessories', 3)
on conflict (slug) do nothing;

insert into products (name, slug, description, price, category_id, images, in_stock, featured, created_at) values
  ('Don''t Waste My Soap', 'don-t-waste-my-soap', '', 699.99, (select id from categories where slug = 'home-storage'), array['/images/index.jpg', '/images/index3.jpg', '/images/index1.jpg', '/images/index2.jpg']::text[], true, true, '2025-01-01T00:00:00.000Z'),
  ('Pyramid Electric Kettle', 'pyramid-electric-kettle', 'This is a pyramid electric kettle.', 7499, (select id from categories where slug = 'kitchen-dining'), array['/images/IMG-20221217-WA0001.jpg', '/images/IMG-20221217-WA0003.jpg', '/images/IMG-20221217-WA0010.jpg', '/images/IMG-20221217-WA0016.jpg']::text[], true, false, '2025-01-02T00:00:00.000Z'),
  ('500ml Water Temperature Flask', '500ml-water-temperature-flask', '', 7499, (select id from categories where slug = 'kitchen-dining'), array['/images/index4.jpg', '/images/index10.jpg']::text[], true, false, '2025-01-03T00:00:00.000Z'),
  ('Self-stirring Mug', 'self-stirring-mug', '', 2699, (select id from categories where slug = 'kitchen-dining'), array['/images/IMG-20221217-WA0011.jpg', '/images/IMG-20221217-WA0014.jpg', '/images/IMG-20221217-WA0017.jpg', '/images/IMG-20221217-WA0029.jpg']::text[], true, false, '2025-01-04T00:00:00.000Z'),
  ('Foldable Chinese Wooden Fan', 'foldable-chinese-wooden-fan', '', 1699, (select id from categories where slug = 'gadgets-accessories'), array['/images/IMG-20221217-WA0039.jpg', '/images/IMG-20221217-WA0035.jpg', '/images/IMG-20221217-WA0034.jpg', '/images/IMG-20221217-WA0037.jpg']::text[], true, false, '2025-01-05T00:00:00.000Z'),
  ('Golden Spoons', 'golden-spoons', '', 1699, (select id from categories where slug = 'kitchen-dining'), array['/images/IMG-20221217-WA0053.jpg', '/images/IMG-20221217-WA0051.jpg', '/images/IMG-20221217-WA0052.jpg']::text[], true, false, '2025-01-06T00:00:00.000Z'),
  ('Dumbbell Water Bottle', 'dumbbell-water-bottle', '', 4199, (select id from categories where slug = 'kitchen-dining'), array['/images/index9.jpg']::text[], true, false, '2025-01-07T00:00:00.000Z'),
  ('Electric Food Chopper', 'electric-food-chopper', '', 1699, (select id from categories where slug = 'kitchen-dining'), array['/images/index17.jpg']::text[], true, false, '2025-01-08T00:00:00.000Z'),
  ('Serving Dish', 'serving-dish', '', 3599, (select id from categories where slug = 'kitchen-dining'), array['/images/index12.jpg', '/images/index18.jpg', '/images/index19.jpg']::text[], true, false, '2025-01-09T00:00:00.000Z'),
  ('Mini Basket', 'mini-basket', '', 3199, (select id from categories where slug = 'home-storage'), array['/images/index67.jpg', '/images/index45.jpg']::text[], true, false, '2025-01-10T00:00:00.000Z'),
  ('Electric Lunchbox', 'electric-lunchbox', '', 5499, (select id from categories where slug = 'kitchen-dining'), array['/images/index11.jpg', '/images/index7.jpg', '/images/index6.jpg']::text[], true, false, '2025-01-11T00:00:00.000Z'),
  ('Shoe Rack plus Hanger', 'shoe-rack-plus-hanger', '', 15999, (select id from categories where slug = 'home-storage'), array['/images/index95.jpg']::text[], true, false, '2025-01-12T00:00:00.000Z'),
  ('Toasting Machine', 'toasting-machine', '', 9499, (select id from categories where slug = 'kitchen-dining'), array['/images/index79.jpg']::text[], true, false, '2025-01-13T00:00:00.000Z'),
  ('Student Cutlery', 'student-cutlery', '', 3099, (select id from categories where slug = 'kitchen-dining'), array['/images/index98.jpg']::text[], true, false, '2025-01-14T00:00:00.000Z'),
  ('Cutting Board', 'cutting-board', '', 1399, (select id from categories where slug = 'kitchen-dining'), array['/images/index69.jpg']::text[], true, false, '2025-01-15T00:00:00.000Z'),
  ('Mini Electric Kettles', 'mini-electric-kettles', '', 3199, (select id from categories where slug = 'kitchen-dining'), array['/images/index58.jpg']::text[], true, false, '2025-01-16T00:00:00.000Z'),
  ('Two Sided Hotplate', 'two-sided-hotplate', '', 16999, (select id from categories where slug = 'kitchen-dining'), array['/images/index57.jpg', '/images/index43.jpg']::text[], true, false, '2025-01-17T00:00:00.000Z'),
  ('Not Laundry Bag', 'not-laundry-bag', '', 1199, (select id from categories where slug = 'home-storage'), array['/images/index54.jpg', '/images/index53.jpg', '/images/index56.jpg']::text[], true, false, '2025-01-18T00:00:00.000Z'),
  ('One Side Hotplate', 'one-side-hotplate', '', 8499, (select id from categories where slug = 'kitchen-dining'), array['/images/index41.jpg', '/images/index33.jpg']::text[], true, false, '2025-01-19T00:00:00.000Z'),
  ('Hair Dryer (small)', 'hair-dryer-small', '', 2400, (select id from categories where slug = 'beauty-personal-care'), array['/images/index55.jpg', '/images/index39.jpg', '/images/index46.jpg']::text[], true, false, '2025-01-20T00:00:00.000Z'),
  ('Food Warmers (small)', 'food-warmers-small', '', 2199, (select id from categories where slug = 'kitchen-dining'), array['/images/index77.jpg']::text[], true, false, '2025-01-21T00:00:00.000Z'),
  ('Seven Set Plastic Containers', 'seven-set-plastic-containers', '', 4199, (select id from categories where slug = 'kitchen-dining'), array['/images/index47.jpg', '/images/index51.jpg']::text[], true, false, '2025-01-22T00:00:00.000Z'),
  ('Covered Plate Rack', 'covered-plate-rack', '', 16999, (select id from categories where slug = 'kitchen-dining'), array['/images/index35.jpg']::text[], true, false, '2025-01-23T00:00:00.000Z'),
  ('Flower Food Warmer', 'flower-food-warmer', '', 23999, (select id from categories where slug = 'kitchen-dining'), array['/images/index31.jpg']::text[], true, false, '2025-01-24T00:00:00.000Z'),
  ('Multi-Colour Straw Flask', 'multi-colour-straw-flask', '', 3199, (select id from categories where slug = 'kitchen-dining'), array['/images/index102.jpg']::text[], true, false, '2025-01-25T00:00:00.000Z'),
  ('Hair Straightener', 'hair-straightener', '', 1899, (select id from categories where slug = 'beauty-personal-care'), array['/images/index103.jpg']::text[], true, true, '2025-01-26T00:00:00.000Z'),
  ('Hair Straightener', 'hair-straightener-2', '', 2899, (select id from categories where slug = 'beauty-personal-care'), array['/images/index104.jpg']::text[], true, false, '2025-01-27T00:00:00.000Z'),
  ('Long Breakable Mugs', 'long-breakable-mugs', '', 2999, (select id from categories where slug = 'kitchen-dining'), array['/images/index105.jpg']::text[], true, false, '2025-01-28T00:00:00.000Z'),
  ('Breakable Toothbrush Holder', 'breakable-toothbrush-holder', '', 1999, (select id from categories where slug = 'home-storage'), array['/images/index106.jpg']::text[], true, false, '2025-01-29T00:00:00.000Z'),
  ('3-Tier Commodity Rack', '3-tier-commodity-rack', '', 9699, (select id from categories where slug = 'home-storage'), array['/images/index107.jpg']::text[], true, false, '2025-01-30T00:00:00.000Z'),
  ('16 Dinner Set', '16-dinner-set', '', 22999, (select id from categories where slug = 'kitchen-dining'), array['/images/index110.jpg']::text[], true, false, '2025-01-31T00:00:00.000Z'),
  ('Plastic Wine Cups', 'plastic-wine-cups', '', 599, (select id from categories where slug = 'kitchen-dining'), array['/images/index108.jpg']::text[], true, true, '2025-02-01T00:00:00.000Z'),
  ('FootMats', 'footmats', '', 4699, (select id from categories where slug = 'home-storage'), array['/images/IMG-20221217-WA0027.jpg', '/images/IMG-20221217-WA0007.jpg', '/images/IMG-20221217-WA0030.jpg', '/images/IMG-20221217-WA0025.jpg']::text[], true, true, '2025-02-02T00:00:00.000Z'),
  ('Electric Handfan', 'electric-handfan', '', 3699, (select id from categories where slug = 'gadgets-accessories'), array['/images/IMG-20221217-WA0028.jpg']::text[], true, false, '2025-02-03T00:00:00.000Z'),
  ('Acrylic Jug with Cups', 'acrylic-jug-with-cups', '', 7499, (select id from categories where slug = 'kitchen-dining'), array['/images/index78.jpg']::text[], true, false, '2025-02-04T00:00:00.000Z'),
  ('Shoe Rack/Cabinet (Medium)', 'shoe-rack-cabinet-medium', '', 10499, (select id from categories where slug = 'home-storage'), array['/images/index111.jpg', '/images/index99.jpg', '/images/index95.jpg']::text[], true, true, '2025-02-05T00:00:00.000Z'),
  ('Large Capacity Laundry Plastic', 'large-capacity-laundry-plastic', '', 5499, (select id from categories where slug = 'home-storage'), array['/images/index109.jpg']::text[], true, true, '2025-02-06T00:00:00.000Z'),
  ('Plastic Wine Cups', 'plastic-wine-cups-2', '', 22999, (select id from categories where slug = 'kitchen-dining'), array['/images/index110.jpg']::text[], true, true, '2025-02-07T00:00:00.000Z'),
  ('Mini Parker and Brush', 'mini-parker-and-brush', '', 16999, (select id from categories where slug = 'home-storage'), array['/images/index91.jpg']::text[], true, false, '2025-02-08T00:00:00.000Z'),
  ('Bathroom Accessories', 'bathroom-accessories', '', 35499, (select id from categories where slug = 'home-storage'), array['/images/index97.jpg', '/images/index93.jpg', '/images/index96.jpg']::text[], true, false, '2025-02-09T00:00:00.000Z'),
  ('Breakable Mugs', 'breakable-mugs', '', 2199, (select id from categories where slug = 'kitchen-dining'), array['/images/index112.jpg', '/images/index105.jpg']::text[], true, true, '2025-02-10T00:00:00.000Z')
on conflict (slug) do nothing;
