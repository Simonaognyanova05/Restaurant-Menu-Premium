require('dotenv').config();

const mongoose = require('mongoose');
const Category = require('../models/category.model');
const Dish = require('../models/dish.model');

const categories = [
  {
    name: 'Малки ястия',
    slug: 'malki-yastiya',
    description: 'Фини първи вкусове за споделяне.',
    sortOrder: 1,
    dishes: [
      {
        name: 'Хляб с квас и култивирано масло',
        description: 'Домашен хляб с квас, пушено масло и морска сол.',
        price: 8,
        allergens: ['глутен', 'мляко'],
        dietaryTags: ['вегетарианско'],
        sortOrder: 1,
        isFeatured: false,
        imageUrl: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=900&q=85',
      },
      {
        name: 'Тартар от българско говеждо',
        description: 'Ръчно нарязано говеждо, жълтък, каперси и хрупкав лук.',
        price: 24,
        allergens: ['яйца', 'горчица'],
        dietaryTags: [],
        sortOrder: 2,
        isFeatured: true,
        imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85',
      },
      {
        name: 'Печено цвекло и козе сирене',
        description: 'Цвекло от местна ферма, козе сирене, орехи и балсамов оцет.',
        price: 18,
        allergens: ['мляко', 'ядки'],
        dietaryTags: ['вегетарианско'],
        sortOrder: 3,
        isFeatured: false,
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85',
      },
    ],
  },
  {
    name: 'От морето',
    slug: 'ot-moreto',
    description: 'Дневен улов, чисти вкусове и морски характер.',
    sortOrder: 2,
    dishes: [
      {
        name: 'Гребен миди с праз',
        description: 'Гребен миди, праз, ябълка и сос от шампанско.',
        price: 32,
        allergens: ['мекотели', 'мляко'],
        dietaryTags: [],
        sortOrder: 1,
        isFeatured: true,
        imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=85',
      },
      {
        name: 'Див лаврак на жар',
        description: 'Филе от лаврак, копър, лимон и масло от печен чесън.',
        price: 38,
        allergens: ['риба', 'мляко'],
        dietaryTags: ['без глутен'],
        sortOrder: 2,
        isFeatured: false,
        imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=85',
      },
    ],
  },
  {
    name: 'От градината',
    slug: 'ot-gradinata',
    description: 'Зеленчуци в своя най-добър сезон.',
    sortOrder: 3,
    dishes: [
      {
        name: 'Картоф от Родопите',
        description: 'Печен картоф, трюфел, стар кашкавал и див лук.',
        price: 22,
        allergens: ['мляко'],
        dietaryTags: ['вегетарианско', 'без глутен'],
        sortOrder: 1,
        isFeatured: true,
        imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=85',
      },
      {
        name: 'Моркови с мед и естрагон',
        description: 'Млади моркови, ферментирал мед, естрагон и слънчоглед.',
        price: 16,
        allergens: ['ядки'],
        dietaryTags: ['веган', 'без глутен'],
        sortOrder: 2,
        isFeatured: false,
        imageUrl: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=900&q=85',
      },
    ],
  },
  {
    name: 'Сладък финал',
    slug: 'sladak-final',
    description: 'Последна нота, която остава.',
    sortOrder: 4,
    dishes: [
      {
        name: 'Шоколад, кафе и сол',
        description: 'Мус от тъмен шоколад, кафе крем и карамелизирана сол.',
        price: 14,
        allergens: ['мляко', 'яйца'],
        dietaryTags: ['вегетарианско'],
        sortOrder: 1,
        isFeatured: false,
        imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85',
      },
      {
        name: 'Круша с ванилия и мащерка',
        description: 'Поширана круша, ванилов крем, мащерка и лешников крокант.',
        price: 13,
        allergens: ['мляко', 'ядки'],
        dietaryTags: ['вегетарианско'],
        sortOrder: 2,
        isFeatured: false,
        imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=900&q=85',
      },
    ],
  },
];

const seedMenu = async () => {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not configured');

  await mongoose.connect(process.env.MONGODB_URI);
  let dishCount = 0;

  for (const categoryData of categories) {
    const { dishes, ...categoryFields } = categoryData;
    const category = await Category.findOneAndUpdate(
      { slug: categoryFields.slug },
      { $set: categoryFields },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );

    for (const dishData of dishes) {
      await Dish.findOneAndUpdate(
        { category: category._id, name: dishData.name },
        { $set: { ...dishData, category: category._id, currency: 'EUR', isAvailable: true } },
        { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
      );
      dishCount += 1;
    }
  }

  console.log(`Seed complete: ${categories.length} categories and ${dishCount} dishes are ready.`);
};

seedMenu()
  .catch((error) => {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
