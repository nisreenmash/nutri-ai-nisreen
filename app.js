import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Setup for serving static files in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json());
app.use(express.static(__dirname)); 

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// --- 1. MEAL DATABASE ---
const mealDB = {
    "middle eastern": {
        breakfast: [
            { name_ar: "فول مدمس", desc_ar: "1 كوب فول (200غ) + 1 ملعقة زيت + كمون", name_en: "Foul Moudamas", desc_en: "1 cup fava beans + olive oil", cal: 340, tags: ["vegan", "gluten_free"] },
            { name_ar: "ساندويش لبنة", desc_ar: "رغيف قمح صغير (50غ) + 3 ملاعق لبنة", name_en: "Labneh Sandwich", desc_en: "1 small whole wheat pita + 3 tbsp labneh", cal: 280, tags: ["lactose", "gluten", "vegetarian"] },
            { name_ar: "بيض مسلوق", desc_ar: "2 بيضة مسلوقة + رشة دقة + خيار", name_en: "Boiled Eggs", desc_en: "2 Boiled Eggs + Dukkah spice + Cucumber", cal: 220, tags: ["gluten_free", "vegetarian"] },
            { name_ar: "منقوشة جبنة", desc_ar: "نصف منقوشة (قطر 15سم) + خضار", name_en: "Cheese Manakish", desc_en: "1/2 Manakish (medium) + Veggies", cal: 350, tags: ["gluten", "lactose", "vegetarian"] },
            { name_ar: "حمص وخضار", desc_ar: "6 ملاعق حمص + 1 جزر + 1 خيار", name_en: "Hummus Dip", desc_en: "6 tbsp Hummus + 1 Carrot + 1 Cucumber", cal: 300, tags: ["vegan", "gluten_free"] },
            { name_ar: "فتة حمص", desc_ar: "6 ملاعق حمص + نصف رغيف محمص + 4 ملاعق لبن", name_en: "Fatteh", desc_en: "6 tbsp Chickpeas + 1/2 toasted pita + 4 tbsp Yogurt", cal: 450, tags: ["gluten", "lactose", "vegetarian"] },
            { name_ar: "شكشوكة", desc_ar: "2 بيضة مطبوخة مع 1 طماطم وبصل", name_en: "Shakshuka", desc_en: "2 Poached Eggs in Tomato & Onion sauce", cal: 320, tags: ["gluten_free", "vegetarian"] },
            { name_ar: "جبنة حلوم", desc_ar: "3 شرائح حلوم (90غ) مشوية + طماطم", name_en: "Grilled Halloumi", desc_en: "3 slices Halloumi (90g) + Tomato", cal: 280, tags: ["lactose", "gluten_free", "vegetarian"] },
            { name_ar: "مسبحة", desc_ar: "5 ملاعق مسبحة + 1 ملعقة تتبيلة حارة", name_en: "Musabaha", desc_en: "5 tbsp Creamy Hummus + 1 tbsp Chili dressing", cal: 380, tags: ["vegan", "gluten_free"] },
            { name_ar: "قلاية بندورة", desc_ar: "2 طماطم مقلية + ثوم + ربع رغيف", name_en: "Galayet Bandora", desc_en: "2 Sautéed Tomatoes + Garlic + 1/4 Pita", cal: 200, tags: ["vegan", "gluten"] },
            { name_ar: "مناقيش زعتر", desc_ar: "نصف منقوشة زعتر + كوب شاي بدون سكر", name_en: "Zaatar Manakish", desc_en: "1/2 Zaatar Manakish + Tea (sugar-free)", cal: 300, tags: ["gluten", "vegan"] },
            { name_ar: "بيض عيون", desc_ar: "2 بيض مقلي بملعقة صغيرة زيت", name_en: "Sunny Side Up", desc_en: "2 Fried Eggs (1 tsp Oil)", cal: 250, tags: ["gluten_free", "vegetarian"] },
            { name_ar: "سلطة لبنة", desc_ar: "4 ملاعق لبنة + خيار ونعنع وزيتون", name_en: "Labneh Salad", desc_en: "4 tbsp Labneh + Cucumber + Mint + Olives", cal: 200, tags: ["lactose", "gluten_free", "vegetarian"] },
            { name_ar: "شوفان بالحليب", desc_ar: "5 ملاعق شوفان + 1 كوب حليب قليل الدسم", name_en: "Oatmeal", desc_en: "5 tbsp Oats + 1 cup Low-fat Milk", cal: 350, tags: ["lactose", "gluten", "vegetarian"] },
            { name_ar: "توست أفوكادو", desc_ar: "1 توست أسمر + نصف أفوكادو مهروس", name_en: "Avocado Toast", desc_en: "1 Brown Toast + 1/2 Mashed Avocado", cal: 280, tags: ["gluten", "vegan"] },
            { name_ar: "بيض بالطماطم", desc_ar: "بيض مخفوق مع طماطم", name_en: "Scrambled Eggs Tomato", desc_en: "Scrambled eggs with tomato", cal: 260, tags: ["gluten_free", "vegetarian"] },
            { name_ar: "سلطة فواكه وزبادي", desc_ar: "كوب زبادي + فواكه", name_en: "Yogurt Parfait", desc_en: "Yogurt cup + mixed fruits", cal: 250, tags: ["lactose", "gluten_free", "vegetarian"] },
            { name_ar: "زبدة فول وتوست", desc_ar: "توست + زبدة فول سوداني", name_en: "PB Toast", desc_en: "Toast + Peanut Butter", cal: 300, tags: ["nuts", "gluten", "vegan"] },
            { name_ar: "بانكيك صحي", desc_ar: "2 بانكيك شوفان", name_en: "Oat Pancakes", desc_en: "2 Oat pancakes", cal: 320, tags: ["gluten", "vegetarian"] },
            { name_ar: "سموثي أخضر", desc_ar: "سبانخ + موز + حليب لوز", name_en: "Green Smoothie", desc_en: "Spinach + banana + almond milk", cal: 180, tags: ["vegan", "gluten_free"] }
        ],
        lunch: [
            { name_ar: "مجدرة", desc_ar: "6 ملاعق مجدرة (برغل أو رز) + سلطة", name_en: "Mujadara", desc_en: "6 tbsp Mujadara (Rice/Bulgur) + Salad", cal: 500, tags: ["vegan", "gluten_free"] },
            { name_ar: "شيش طاووق", desc_ar: "2 سيخ (200غ) + نصف رغيف + ثومية", name_en: "Shish Tawook", desc_en: "2 Skewers (200g) + 1/2 Pita + Garlic dip", cal: 450, tags: ["gluten", "high-protein"] },
            { name_ar: "منسف (لايت)", desc_ar: "150غ لحم بدون دهن + 6 ملاعق رز + جميد", name_en: "Mansaf (Lean)", desc_en: "150g Lean Meat + 6 tbsp Rice + Jameed", cal: 650, tags: ["lactose", "gluten_free", "high-protein"] },
            { name_ar: "بامية ورز", desc_ar: "1 كوب بامية مطبوخة + 5 ملاعق رز", name_en: "Okra Stew", desc_en: "1 cup Okra Stew + 5 tbsp Rice", cal: 400, tags: ["gluten_free"] },
            { name_ar: "صيادية سمك", desc_ar: "فيليه سمك (200غ) + 6 ملاعق رز صيادية", name_en: "Fish Sayadieh", desc_en: "200g Fish Fillet + 6 tbsp Spiced Rice", cal: 550, tags: ["gluten_free", "high-protein", "pescatarian"] },
            { name_ar: "كفتة بالطحينة", desc_ar: "2 قطعة كفتة + 3 ملاعق صوص طحينة", name_en: "Kofta Tahini", desc_en: "2 Kofta pieces + 3 tbsp Tahini sauce", cal: 600, tags: ["gluten_free", "high-protein"] },
            { name_ar: "مقلوبة دجاج", desc_ar: "قطعة صدر دجاج + 6 ملاعق رز + باذنجان", name_en: "Maqluba", desc_en: "1 Chicken Breast + 6 tbsp Rice + Eggplant", cal: 580, tags: ["gluten_free", "high-protein"] },
            { name_ar: "فاصوليا خضراء", desc_ar: "1 كوب يخنة + 90غ لحم عجل + رز", name_en: "Green Bean Stew", desc_en: "1 cup Stew + 90g Veal + Rice", cal: 420, tags: ["gluten_free"] },
            { name_ar: "مسخن رول", desc_ar: "2 رول دجاج (خبز شراك) + لبن", name_en: "Musakhan Rolls", desc_en: "2 Chicken Rolls + Yogurt", cal: 500, tags: ["gluten", "high-protein"] },
            { name_ar: "كبة لبنية", desc_ar: "3 حبات كبة + 1 كوب لبن مطبوخ", name_en: "Kibbeh Labanieh", desc_en: "3 Kibbeh balls + 1 cup Cooked Yogurt", cal: 550, tags: ["gluten", "lactose"] },
            { name_ar: "ملوخية ودجاج", desc_ar: "1 كوب ملوخية + 5 ملاعق رز + دجاج", name_en: "Molokhia", desc_en: "1 cup Molokhia + 5 tbsp Rice + Chicken", cal: 450, tags: ["gluten_free", "high-protein"] },
            { name_ar: "ورق عنب", desc_ar: "10 حبات (يلنجي) + سلطة زبادي", name_en: "Stuffed Grape Leaves", desc_en: "10 pcs (Vegetarian) + Yogurt Salad", cal: 350, tags: ["vegan", "gluten_free"] },
            { name_ar: "دجاج محشي", desc_ar: "نصف صدر دجاج محشي فريك (3 ملاعق)", name_en: "Stuffed Chicken", desc_en: "1/2 Stuffed Chicken Breast (3 tbsp Freekeh)", cal: 550, tags: ["gluten", "high-protein"] },
            { name_ar: "سمك مشوي", desc_ar: "سمكة كاملة (300غ) + سلطة جرجير", name_en: "Grilled Fish", desc_en: "Whole Fish (300g) + Arugula Salad", cal: 400, tags: ["gluten_free", "high-protein", "pescatarian"] },
            { name_ar: "يخنة بطاطا", desc_ar: "1 كوب يخنة بطاطا ولحم + 5 ملاعق رز", name_en: "Potato Stew", desc_en: "1 cup Potato & Meat Stew + 5 tbsp Rice", cal: 500, tags: ["gluten_free"] },
            { name_ar: "بازيلاء وجزر", desc_ar: "1 كوب يخنة + 90غ لحم مفروم + رز", name_en: "Peas & Carrots", desc_en: "1 cup Stew + 90g Minced Meat + Rice", cal: 420, tags: ["gluten_free"] },
            { name_ar: "كباب مشوي", desc_ar: "3 أسياخ كباب (200غ) + سلطة مشوية", name_en: "Grilled Kebab", desc_en: "3 Kebab Skewers (200g) + Grilled Salad", cal: 550, tags: ["gluten_free", "high-protein"] },
            { name_ar: "شاورما صحن", desc_ar: "200غ شاورما (بدون خبز) + سلطة", name_en: "Shawarma Plate", desc_en: "200g Shawarma (No bread) + Salad", cal: 450, tags: ["gluten_free", "high-protein"] },
            { name_ar: "معكرونة بولونيز", desc_ar: "1 كوب معكرونة مسلوقة + لحم مفروم", name_en: "Pasta Bolognese", desc_en: "1 cup Pasta + Minced Meat sauce", cal: 550, tags: ["gluten"] },
            { name_ar: "فاهيتا دجاج", desc_ar: "200غ دجاج + فليفلة وبصل (بدون خبز)", name_en: "Chicken Fajita", desc_en: "200g Chicken + Peppers (No Bread)", cal: 400, tags: ["gluten_free", "high-protein"] },
            { name_ar: "عدس بحامض", desc_ar: "1.5 كوب عدس وسلق + ليمون", name_en: "Lemon Lentil Stew", desc_en: "1.5 cup Lentil & Chard + Lemon", cal: 350, tags: ["vegan", "gluten_free"] },
            { name_ar: "ستيك لحم", desc_ar: "شريحة ستيك (150غ) + خضار سوتيه", name_en: "Steak & Veggies", desc_en: "150g Steak + Sautéed Veggies", cal: 500, tags: ["gluten_free", "high-protein"] },
            { name_ar: "كبسة دجاج", desc_ar: "قطعة دجاج + 6 ملاعق رز بسمتي", name_en: "Chicken Kabsa", desc_en: "1 Chicken piece + 6 tbsp Basmati Rice", cal: 600, tags: ["gluten_free", "high-protein"] },
            { name_ar: "كشري", desc_ar: "1 كوب كشري + صلصة طماطم", name_en: "Koshary", desc_en: "1 cup Koshary + Tomato Sauce", cal: 550, tags: ["vegan", "gluten"] },
            { name_ar: "صينية خضار", desc_ar: "خضار مشكلة بالفرن + صدر دجاج", name_en: "Roasted Veggies", desc_en: "Oven roasted veggies + Chicken Breast", cal: 400, tags: ["gluten_free", "high-protein"] }
        ],
        dinner: [
            { name_ar: "شوربة عدس", desc_ar: "1.5 كوب (350مل) + ليمون", name_en: "Lentil Soup", desc_en: "1.5 cups (350ml) + Lemon", cal: 290, tags: ["vegan", "gluten_free"] },
            { name_ar: "سلطة حلوم", desc_ar: "3 شرائح حلوم + 2 كوب خضار", name_en: "Halloumi Salad", desc_en: "3 slices Halloumi + 2 cups Veggies", cal: 320, tags: ["lactose", "gluten_free", "vegetarian"] },
            { name_ar: "تونا بالماء", desc_ar: "علبة صغيرة (ماء) + نصف كوب ذرة", name_en: "Tuna Salad", desc_en: "1 small Tuna can (water) + 1/2 cup Corn", cal: 250, tags: ["gluten_free", "high-protein", "pescatarian"] },
            { name_ar: "متبل باذنجان", desc_ar: "4 ملاعق متبل + نصف رغيف صغير", name_en: "Baba Ganoush", desc_en: "4 tbsp Dip + 1/2 small Pita", cal: 280, tags: ["vegan", "gluten"] },
            { name_ar: "زبادي وخيار", desc_ar: "علبة زبادي (170غ) + 2 خيار", name_en: "Yogurt Cucumber", desc_en: "1 Yogurt pot (170g) + 2 Cucumbers", cal: 180, tags: ["lactose", "gluten_free", "vegetarian"] },
            { name_ar: "سلطة يونانية", desc_ar: "خضار + 30غ جبنة فيتا + زيتون", name_en: "Greek Salad", desc_en: "Veggies + 30g Feta + Olives", cal: 220, tags: ["lactose", "gluten_free", "vegetarian"] },
            { name_ar: "أومليت فطر", desc_ar: "2 بيضة + نصف كوب فطر", name_en: "Mushroom Omelette", desc_en: "2 Eggs + 1/2 cup Mushrooms", cal: 240, tags: ["gluten_free", "vegetarian"] },
            { name_ar: "فتوش", desc_ar: "صحن كبير + ربع رغيف محمص", name_en: "Fattoush", desc_en: "Large Salad + 1/4 Toasted Bread", cal: 200, tags: ["gluten", "vegan"] },
            { name_ar: "صدر دجاج", desc_ar: "150غ مشوي + سلطة خضراء", name_en: "Grilled Chicken", desc_en: "150g Grilled Breast + Green Salad", cal: 300, tags: ["gluten_free", "high-protein"] },
            { name_ar: "فول باللبن", desc_ar: "1 كوب فول + 2 ملعقة طحينة ولبن", name_en: "Foul with Yogurt", desc_en: "1 cup Fava + 2 tbsp Tahini/Yogurt", cal: 310, tags: ["lactose", "gluten_free", "vegetarian"] },
            { name_ar: "سلطة سيزر", desc_ar: "100غ دجاج + خس + صوص خفيف", name_en: "Caesar Salad", desc_en: "100g Chicken + Lettuce + Light Sauce", cal: 350, tags: ["gluten_free", "high-protein"] },
            { name_ar: "شوربة خضار", desc_ar: "2 كوب خضار مسلوقة (بدون دهن)", name_en: "Veggie Soup", desc_en: "2 cups Boiled Veggies (No Oil)", cal: 150, tags: ["vegan", "gluten_free"] },
            { name_ar: "توست تونا", desc_ar: "1 توست أسمر + نصف علبة تونا", name_en: "Tuna Toast", desc_en: "1 Brown Toast + 1/2 Tuna Can", cal: 280, tags: ["gluten", "pescatarian"] },
            { name_ar: "جبنة قريش", desc_ar: "1 كوب (200غ) + طماطم", name_en: "Cottage Cheese", desc_en: "1 cup (200g) + Tomato", cal: 200, tags: ["lactose", "gluten_free", "vegetarian"] },
            { name_ar: "سلطة كينوا", desc_ar: "6 ملاعق كينوا + بقدونس ورمان", name_en: "Quinoa Salad", desc_en: "6 tbsp Quinoa + Parsley & Pomegranate", cal: 280, tags: ["vegan", "gluten_free"] },
            { name_ar: "سلطة جرجير", desc_ar: "جرجير + بصل + سماق (بدون زيت)", name_en: "Arugula Salad", desc_en: "Arugula + Onion + Sumac (No Oil)", cal: 100, tags: ["vegan", "gluten_free"] },
            { name_ar: "لبنة وخضار", desc_ar: "3 ملاعق لبنة + خيار وجزر", name_en: "Labneh Plate", desc_en: "3 tbsp Labneh + Cucumber & Carrots", cal: 180, tags: ["lactose", "gluten_free", "vegetarian"] },
            { name_ar: "شوربة شوفان", desc_ar: "1 كوب شوربة شوفان ودجاج", name_en: "Oat & Chicken Soup", desc_en: "1 cup Oat & Chicken Soup", cal: 250, tags: ["gluten", "high-protein"] },
            { name_ar: "بطاطا مشوية", desc_ar: "حبة متوسطة + ملعقة لبنة", name_en: "Baked Potato", desc_en: "Medium Potato + 1 tbsp Labneh", cal: 200, tags: ["lactose", "gluten_free", "vegetarian"] },
            { name_ar: "سلطة تونا", desc_ar: "نصف علبة تونا + فاصوليا حمراء", name_en: "Tuna Bean Salad", desc_en: "1/2 Tuna Can + Red Kidney Beans", cal: 250, tags: ["gluten_free", "high-protein"] }
        ],
        snacks: [
            { name_ar: "تمر وجوز", desc_ar: "3 حبات تمر + 3 أنصاف جوز", name_en: "Dates & Walnuts", desc_en: "3 Dates + 3 Walnut halves", cal: 190, tags: ["nuts", "vegan", "sugar", "gluten_free"] },
            { name_ar: "فواكه", desc_ar: "تفاحة متوسطة أو كوب فراولة", name_en: "Fruit", desc_en: "Medium Apple or 1 cup Strawberry", cal: 100, tags: ["vegan", "sugar", "gluten_free"] },
            { name_ar: "حمص محمص", desc_ar: "نصف كوب حمص بالفرن", name_en: "Roasted Chickpeas", desc_en: "1/2 cup Oven Roasted Chickpeas", cal: 150, tags: ["vegan", "gluten_free"] },
            { name_ar: "شوكولاتة داكنة", desc_ar: "مكعبين (20غ) 70% كاكاو", name_en: "Dark Chocolate", desc_en: "2 squares (20g) 70% Cocoa", cal: 110, tags: ["sugar", "vegan", "gluten_free"] },
            { name_ar: "لوز ني", desc_ar: "15 حبة لوز غير مملح", name_en: "Raw Almonds", desc_en: "15 Raw Almonds (Unsalted)", cal: 170, tags: ["nuts", "vegan", "gluten_free"] },
            { name_ar: "فشار", desc_ar: "3 أكواب (بدون زيت)", name_en: "Popcorn", desc_en: "3 cups Air-popped Popcorn", cal: 100, tags: ["vegan", "gluten_free"] },
            { name_ar: "ترمس", desc_ar: "1 كوب ترمس مسلوق", name_en: "Lupini Beans", desc_en: "1 cup Boiled Lupini", cal: 110, tags: ["vegan", "gluten_free"] },
            { name_ar: "لبن عيران", desc_ar: "1 كوب (250مل)", name_en: "Ayran", desc_en: "1 cup (250ml) Yogurt Drink", cal: 90, tags: ["lactose", "gluten_free", "vegetarian"] },
            { name_ar: "تفاح وزبدة", desc_ar: "1 تفاحة + 1 ملعقة زبدة فول", name_en: "Apple & Peanut Butter", desc_en: "1 Apple + 1 tsp Peanut Butter", cal: 200, tags: ["nuts", "vegan", "sugar", "gluten_free"] },
            { name_ar: "كعك أرز", desc_ar: "2 قطعة + شريحة جبنة", name_en: "Rice Cakes", desc_en: "2 Rice Cakes + 1 Cheese slice", cal: 140, tags: ["lactose", "gluten_free", "vegetarian"] },
            { name_ar: "خيار وجزر", desc_ar: "2 خيار + 2 جزر مقطع", name_en: "Veggie Sticks", desc_en: "2 Cucumbers + 2 Carrots", cal: 60, tags: ["vegan", "gluten_free"] },
            { name_ar: "كاجو ني", desc_ar: "10 حبات كاجو", name_en: "Raw Cashews", desc_en: "10 Raw Cashews", cal: 160, tags: ["nuts", "vegan", "gluten_free"] },
            { name_ar: "بسكويت شوفان", desc_ar: "2 قطعة (دايجستف لايت)", name_en: "Oat Cookies", desc_en: "2 Digestive Light cookies", cal: 150, tags: ["gluten", "sugar", "vegetarian"] },
            { name_ar: "موزة", desc_ar: "حبة متوسطة", name_en: "Banana", desc_en: "Medium Banana", cal: 100, tags: ["vegan", "sugar", "gluten_free"] },
            { name_ar: "عصير برتقال", desc_ar: "كوب طازج (بدون سكر)", name_en: "Orange Juice", desc_en: "Fresh cup (No Sugar)", cal: 110, tags: ["vegan", "sugar", "gluten_free"] },
            { name_ar: "بذور يقطين", desc_ar: "2 ملعقة طعام", name_en: "Pumpkin Seeds", desc_en: "2 tbsp Pumpkin Seeds", cal: 120, tags: ["vegan", "gluten_free"] },
            { name_ar: "زبادي فواكه", desc_ar: "علبة صغيرة خالية الدسم", name_en: "Fruit Yogurt", desc_en: "Small Low-fat Yogurt", cal: 140, tags: ["lactose", "sugar", "gluten_free"] },
            { name_ar: "سحلب", desc_ar: "نصف كوب (حليب خالي الدسم)", name_en: "Sahlab", desc_en: "1/2 cup (Skim Milk)", cal: 150, tags: ["lactose", "sugar"] },
            { name_ar: "مهلبيبة", desc_ar: "نصف كوب (سكر خفيف)", name_en: "Muhallabia", desc_en: "1/2 cup (Light Sugar)", cal: 180, tags: ["lactose", "sugar", "gluten_free"] },
            { name_ar: "بوظة عربية", desc_ar: "كرة واحدة (بدون فستق)", name_en: "Arabic Ice Cream", desc_en: "1 scoop (No Pistachios)", cal: 200, tags: ["lactose", "sugar", "gluten_free"] }
        ]
    }
};

// --- 2. CHATBOT (Bilingual) ---
app.post("/api/chat", async (req, res) => {
    try {
        const { messages, lang } = req.body;
        const systemMsg = lang === 'ar' 
            ? "أنت دكتور أوليف، خبير تغذية. جاوب دائماً باللغة العربية. كن لطيفاً ومختصراً."
            : "You are Dr. Olive, a nutrition expert. Always answer in English. Be kind and concise.";
            
        if(messages.length === 0 || messages[0].role !== "system") {
            messages.unshift({ role: "system", content: systemMsg });
        } else {
            messages[0].content = systemMsg;
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: messages, 
        });
        res.json({ reply: response.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ reply: "Error: Check .env file." });
    }
});

// --- 3. HEALTH CALCULATIONS ROUTE ---
app.post("/api/calculate", (req, res) => {
    const { weight, height, age, gender, bf, activity, goal, diseases, injuries } = req.body;
    
    // --- DATA CONVERSION ---
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);
    const hasPCOS = (diseases || []).includes('pcos');
    const hasDisease = diseases && diseases.length > 0;
    const hasInjury = injuries && injuries.length > 0;

    // --- SANITY CHECKS ---
    if (h > 240) return res.json({ stop: true, message: "Input Error: Height seems too high (> 240cm)." });
    if (w > 300) return res.json({ stop: true, message: "Input Error: Weight seems extremely high (> 300kg)." });
    if (h < 50) return res.json({ stop: true, message: "Input Error: Height is too low." });
    
    // --- BODY FAT CHECK ---
    if (bf) {
        if (bf < 5) return res.json({ stop: true, message: "Input Error: Body Fat % is dangerously low (< 5%)." });
        if (bf > 60) return res.json({ stop: true, message: "Input Error: Body Fat % is suspiciously high (> 60%)." });
    }

    // --- MEDICAL & POLICY CHECKS ---
    if (gender === 'male' && hasPCOS) {
        return res.json({ stop: true, message: "Error: Biological males cannot be selected with PCOS." });
    }
    if (a < 13) return res.json({ stop: true, message: "Sorry, you are too young for an automated plan." });
    if (a > 80) return res.json({ stop: true, message: "At your age, strict dieting isn't recommended." });
    if (h < 130) return res.json({ stop: true, message: "Height input is quite low (< 130cm). Consult a specialist." });
    if (w < 40) return res.json({ stop: true, message: "Weight is quite low (<40kg). Consult a professional." });
    if (w > 130) return res.json({ stop: true, message: "Based on your weight (>130kg), we highly recommend consulting a healthcare professional." });

    // --- BMI & RESTRICTIONS ---
    const heightM = h / 100;
    const bmi = (w / (heightM * heightM)).toFixed(1);

    if (bmi >= 18.5 && bmi < 25 && goal === 'cut') {
        return res.json({ stop: true, message: `Your BMI is ${bmi} (Normal). We do not provide weight loss plans for healthy individuals.` });
    }

    // --- CALCULATION LOGIC ---
    let bmr;
    if (bf && bf > 0) {
        bmr = 370 + (21.6 * (w * (1 - (bf / 100))));
    } else {
        bmr = (gender === 'male') 
            ? (10 * w) + (6.25 * h) - (5 * a) + 5 
            : (10 * w) + (6.25 * h) - (5 * a) - 161;
    }

    if (hasPCOS) bmr *= 0.95;

    let tdee = bmr * parseFloat(activity);
    if (goal === 'cut') tdee -= 500;
    if (goal === 'bulk') tdee += 300;

    // --- CALORIE FLOORS ---
    if (gender !== 'male' && tdee < 1200) tdee = 1200;
    if (gender === 'male' && tdee < 1500) tdee = 1500;

    // --- STATUS & RESULTS ---
    let status_en = "Normal";
    let status_ar = "وزن طبيعي";
    if (bmi < 18.5) { status_en = "Underweight"; status_ar = "نحافة"; }
    else if (bmi >= 25 && bmi < 30) { status_en = "Overweight"; status_ar = "زيادة وزن"; }
    else if (bmi >= 30) { status_en = "Obese"; status_ar = "سمنة"; }

    const perfectW = (22 * (heightM * heightM)).toFixed(1);
    const diff = (w - perfectW).toFixed(1);

    const macros = {
        p: Math.round(w * 2.0),
        f: Math.round((tdee * 0.25) / 9),
        c: Math.round((tdee - (w * 2.0 * 4) - (tdee * 0.25)) / 4)
    };

    // --- WARNING MESSAGE GENERATOR ---
    let warning_msg = null;
    let alerts = [];

    if (hasDisease) alerts.push("Chronic Condition (Consult Physician)");
    if (hasInjury) alerts.push("Workout Injury (Consult Coach/PT)");

    if (alerts.length > 0) {
        warning_msg = "⚠️ Medical Notice: " + alerts.join(" & ") + ". We have adjusted your plan for safety, but please consult a professional before starting.";
    }

    res.json({ 
        cals: Math.round(tdee), 
        macros, 
        bmi, 
        bmr: Math.round(bmr),
        status_en,
        status_ar,
        perfectW,
        diff,
        warning_msg
    });
});

// --- 4. MEAL REGENERATOR ROUTE ---
app.post("/api/regen-meal", (req, res) => {
    const { type, allergies, diseases, targetCalories } = req.body; 
    const options = mealDB["middle eastern"][type] || mealDB["middle eastern"]["lunch"];
    
    const algs = Array.isArray(allergies) ? allergies : [];
    const dis = Array.isArray(diseases) ? diseases : [];

    let safeOptions = options.filter(meal => {
        const mTags = meal.tags || [];
        if (algs.includes('nuts') && mTags.includes('nuts')) return false;
        if (algs.includes('gluten') && mTags.includes('gluten')) return false;
        if (algs.includes('lactose') && mTags.includes('lactose')) return false;
        if (dis.includes('diabetes') && mTags.includes('sugar')) return false;
        return true;
    });

    if (safeOptions.length === 0) {
        safeOptions = [{ name_ar: "خيار وجزر", desc_ar: "خضار مقطعة (آمن)", name_en: "Veggie Sticks", desc_en: "Safe snack", cal: 50 }]; 
    }

    if (targetCalories) {
        safeOptions.sort((a, b) => Math.abs(a.cal - targetCalories) - Math.abs(b.cal - targetCalories));
        res.json(safeOptions[0]); 
    } else {
        res.json(safeOptions[Math.floor(Math.random() * safeOptions.length)]);
    }
});

app.listen(PORT, () => console.log(`Nutri-AI active on port ${PORT}`));