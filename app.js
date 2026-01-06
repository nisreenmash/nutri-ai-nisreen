import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json());
app.use(express.static(__dirname)); 

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// --- 1. FULL MEAL DATABASE (With Macros) ---
const mealDB = {
    "middle eastern": {
        breakfast: [
            { name_ar: "فول مدمس", desc_ar: "1 كوب فول (200غ) + 1 ملعقة زيت + كمون", name_en: "Foul Moudamas", desc_en: "1 cup fava beans + olive oil", cal: 340, macros: { p: 14, f: 14, c: 45 }, tags: ["vegan", "gluten_free"] },
            { name_ar: "ساندويش لبنة", desc_ar: "رغيف قمح صغير (50غ) + 3 ملاعق لبنة", name_en: "Labneh Sandwich", desc_en: "1 small whole wheat pita + 3 tbsp labneh", cal: 280, macros: { p: 10, f: 12, c: 35 }, tags: ["lactose", "gluten", "vegetarian"] },
            { name_ar: "بيض مسلوق", desc_ar: "2 بيضة مسلوقة + رشة دقة + خيار", name_en: "Boiled Eggs", desc_en: "2 Boiled Eggs + Dukkah spice + Cucumber", cal: 155, macros: { p: 13, f: 11, c: 1 }, tags: ["gluten_free", "vegetarian"] },
            { name_ar: "منقوشة جبنة", desc_ar: "نصف منقوشة (قطر 15سم) + خضار", name_en: "Cheese Manakish", desc_en: "1/2 Manakish (medium) + Veggies", cal: 350, macros: { p: 12, f: 18, c: 38 }, tags: ["gluten", "lactose", "vegetarian"] },
            { name_ar: "حمص وخضار", desc_ar: "6 ملاعق حمص + 1 جزر + 1 خيار", name_en: "Hummus Dip", desc_en: "6 tbsp Hummus + 1 Carrot + 1 Cucumber", cal: 300, macros: { p: 8, f: 18, c: 25 }, tags: ["vegan", "gluten_free"] },
            { name_ar: "فتة حمص", desc_ar: "6 ملاعق حمص + نصف رغيف محمص + 4 ملاعق لبن", name_en: "Fatteh", desc_en: "6 tbsp Chickpeas + 1/2 toasted pita + 4 tbsp Yogurt", cal: 450, macros: { p: 18, f: 15, c: 65 }, tags: ["gluten", "lactose", "vegetarian"] },
            { name_ar: "شكشوكة", desc_ar: "2 بيضة مطبوخة مع 1 طماطم وبصل", name_en: "Shakshuka", desc_en: "2 Poached Eggs in Tomato & Onion sauce", cal: 320, macros: { p: 14, f: 22, c: 12 }, tags: ["gluten_free", "vegetarian"] },
            { name_ar: "جبنة حلوم", desc_ar: "3 شرائح حلوم (90غ) مشوية + طماطم", name_en: "Grilled Halloumi", desc_en: "3 slices Halloumi (90g) + Tomato", cal: 280, macros: { p: 20, f: 22, c: 2 }, tags: ["lactose", "gluten_free", "vegetarian"] },
            { name_ar: "مسبحة", desc_ar: "5 ملاعق مسبحة + 1 ملعقة تتبيلة حارة", name_en: "Musabaha", desc_en: "5 tbsp Creamy Hummus + 1 tbsp Chili dressing", cal: 380, macros: { p: 10, f: 28, c: 22 }, tags: ["vegan", "gluten_free"] },
            { name_ar: "قلاية بندورة", desc_ar: "2 طماطم مقلية + ثوم + ربع رغيف", name_en: "Galayet Bandora", desc_en: "2 Sautéed Tomatoes + Garlic + 1/4 Pita", cal: 200, macros: { p: 4, f: 8, c: 30 }, tags: ["vegan", "gluten"] },
            { name_ar: "مناقيش زعتر", desc_ar: "نصف منقوشة زعتر + كوب شاي بدون سكر", name_en: "Zaatar Manakish", desc_en: "1/2 Zaatar Manakish + Tea (sugar-free)", cal: 300, macros: { p: 5, f: 15, c: 35 }, tags: ["gluten", "vegan"] },
            { name_ar: "بيض عيون", desc_ar: "2 بيض مقلي بملعقة صغيرة زيت", name_en: "Sunny Side Up", desc_en: "2 Fried Eggs (1 tsp Oil)", cal: 250, macros: { p: 14, f: 20, c: 1 }, tags: ["gluten_free", "vegetarian"] },
            { name_ar: "سلطة لبنة", desc_ar: "4 ملاعق لبنة + خيار ونعنع وزيتون", name_en: "Labneh Salad", desc_en: "4 tbsp Labneh + Cucumber + Mint + Olives", cal: 200, macros: { p: 8, f: 15, c: 8 }, tags: ["lactose", "gluten_free", "vegetarian"] },
            { name_ar: "شوفان بالحليب", desc_ar: "5 ملاعق شوفان + 1 كوب حليب قليل الدسم", name_en: "Oatmeal", desc_en: "5 tbsp Oats + 1 cup Low-fat Milk", cal: 350, macros: { p: 14, f: 6, c: 60 }, tags: ["lactose", "gluten", "vegetarian"] },
            { name_ar: "توست أفوكادو", desc_ar: "1 توست أسمر + نصف أفوكادو مهروس", name_en: "Avocado Toast", desc_en: "1 Brown Toast + 1/2 Mashed Avocado", cal: 280, macros: { p: 6, f: 18, c: 25 }, tags: ["gluten", "vegan"] },
            { name_ar: "بيض بالطماطم", desc_ar: "بيض مخفوق مع طماطم", name_en: "Scrambled Eggs Tomato", desc_en: "Scrambled eggs with tomato", cal: 260, macros: { p: 14, f: 18, c: 6 }, tags: ["gluten_free", "vegetarian"] },
            { name_ar: "سلطة فواكه وزبادي", desc_ar: "كوب زبادي + فواكه", name_en: "Yogurt Parfait", desc_en: "Yogurt cup + mixed fruits", cal: 250, macros: { p: 12, f: 4, c: 40 }, tags: ["lactose", "gluten_free", "vegetarian"] },
            { name_ar: "زبدة فول وتوست", desc_ar: "توست + زبدة فول سوداني", name_en: "PB Toast", desc_en: "Toast + Peanut Butter", cal: 300, macros: { p: 10, f: 16, c: 28 }, tags: ["nuts", "gluten", "vegan"] },
            { name_ar: "بانكيك صحي", desc_ar: "2 بانكيك شوفان", name_en: "Oat Pancakes", desc_en: "2 Oat pancakes", cal: 320, macros: { p: 10, f: 8, c: 50 }, tags: ["gluten", "vegetarian"] },
            { name_ar: "سموثي أخضر", desc_ar: "سبانخ + موز + حليب لوز", name_en: "Green Smoothie", desc_en: "Spinach + banana + almond milk", cal: 180, macros: { p: 3, f: 3, c: 35 }, tags: ["vegan", "gluten_free"] },
            { name_ar: "بيض بالسجق", desc_ar: "2 بيض + 30غ سجق بلدي", name_en: "Eggs with Sujuk", desc_en: "2 Eggs + 30g Sujuk sausage", cal: 350, macros: { p: 18, f: 28, c: 2 }, tags: ["gluten_free", "high-protein"] },
            { name_ar: "حلوم وبطيخ", desc_ar: "3 شرائح حلوم + كوب بطيخ", name_en: "Halloumi & Watermelon", desc_en: "3 Slices Halloumi + 1 cup Watermelon", cal: 260, macros: { p: 15, f: 18, c: 12 }, tags: ["lactose", "gluten_free", "vegetarian"] },
            { name_ar: "دبس وطحينة", desc_ar: "2 ملعقة طحينة + 1 ملعقة دبس + خبز", name_en: "Tahini & Molasses", desc_en: "2 tbsp Tahini + 1 tbsp Molasses + Bread", cal: 380, macros: { p: 8, f: 22, c: 40 }, tags: ["vegan", "gluten"] },
            { name_ar: "فطائر سبانخ", desc_ar: "2 حبة فطائر سبانخ (مخبوزة)", name_en: "Spinach Fatayer", desc_en: "2 Spinach Pastries (Baked)", cal: 320, macros: { p: 8, f: 14, c: 42 }, tags: ["gluten", "vegan"] },
            { name_ar: "ساندويش فلافل", desc_ar: "نصف رغيف + 3 حبات فلافل + طحينة", name_en: "Falafel Sandwich", desc_en: "1/2 Pita + 3 Falafel + Tahini", cal: 400, macros: { p: 12, f: 18, c: 50 }, tags: ["gluten", "vegan"] },
            { name_ar: "كبدة دجاج", desc_ar: "150غ كبدة مقلية بملعقة زيت", name_en: "Chicken Liver", desc_en: "150g Sautéed Chicken Liver", cal: 280, macros: { p: 25, f: 12, c: 5 }, tags: ["gluten_free", "high-protein"] },
            { name_ar: "بيض بالبطاطا", desc_ar: "2 بيض + بطاطا مكعبات", name_en: "Potato & Eggs", desc_en: "2 Eggs + Diced Potatoes", cal: 350, macros: { p: 14, f: 16, c: 30 }, tags: ["gluten_free", "vegetarian"] },
            { name_ar: "عدس مدمس", desc_ar: "1 كوب عدس مطبوخ + زيت زيتون", name_en: "Lentil Foul", desc_en: "1 cup Stewed Lentils + Olive Oil", cal: 320, macros: { p: 18, f: 8, c: 45 }, tags: ["vegan", "gluten_free"] }
        ],
        lunch: [
            { name_ar: "مجدرة", desc_ar: "6 ملاعق مجدرة (برغل أو رز) + سلطة", name_en: "Mujadara", desc_en: "6 tbsp Mujadara (Rice/Bulgur) + Salad", cal: 500, macros: { p: 18, f: 12, c: 80 }, tags: ["vegan", "gluten_free"] },
            { name_ar: "شيش طاووق", desc_ar: "2 سيخ (200غ) + نصف رغيف + ثومية", name_en: "Shish Tawook", desc_en: "2 Skewers (200g) + 1/2 Pita + Garlic dip", cal: 450, macros: { p: 45, f: 15, c: 35 }, tags: ["gluten", "high-protein"] },
            { name_ar: "منسف (لايت)", desc_ar: "150غ لحم بدون دهن + 6 ملاعق رز + جميد", name_en: "Mansaf (Lean)", desc_en: "150g Lean Meat + 6 tbsp Rice + Jameed", cal: 650, macros: { p: 40, f: 25, c: 65 }, tags: ["lactose", "gluten_free", "high-protein"] },
            { name_ar: "بامية ورز", desc_ar: "1 كوب بامية مطبوخة + 5 ملاعق رز", name_en: "Okra Stew", desc_en: "1 cup Okra Stew + 5 tbsp Rice", cal: 400, macros: { p: 20, f: 12, c: 50 }, tags: ["gluten_free"] },
            { name_ar: "صيادية سمك", desc_ar: "فيليه سمك (200غ) + 6 ملاعق رز صيادية", name_en: "Fish Sayadieh", desc_en: "200g Fish Fillet + 6 tbsp Spiced Rice", cal: 550, macros: { p: 40, f: 18, c: 55 }, tags: ["gluten_free", "high-protein", "pescatarian"] },
            { name_ar: "كفتة بالطحينة", desc_ar: "2 قطعة كفتة + 3 ملاعق صوص طحينة", name_en: "Kofta Tahini", desc_en: "2 Kofta pieces + 3 tbsp Tahini sauce", cal: 600, macros: { p: 35, f: 40, c: 15 }, tags: ["gluten_free", "high-protein"] },
            { name_ar: "مقلوبة دجاج", desc_ar: "قطعة صدر دجاج + 6 ملاعق رز + باذنجان", name_en: "Maqluba", desc_en: "1 Chicken Breast + 6 tbsp Rice + Eggplant", cal: 580, macros: { p: 35, f: 20, c: 65 }, tags: ["gluten_free", "high-protein"] },
            { name_ar: "فاصوليا خضراء", desc_ar: "1 كوب يخنة + 90غ لحم عجل + رز", name_en: "Green Bean Stew", desc_en: "1 cup Stew + 90g Veal + Rice", cal: 420, macros: { p: 25, f: 14, c: 45 }, tags: ["gluten_free"] },
            { name_ar: "مسخن رول", desc_ar: "2 رول دجاج (خبز شراك) + لبن", name_en: "Musakhan Rolls", desc_en: "2 Chicken Rolls + Yogurt", cal: 500, macros: { p: 30, f: 22, c: 45 }, tags: ["gluten", "high-protein"] },
            { name_ar: "كبة لبنية", desc_ar: "3 حبات كبة + 1 كوب لبن مطبوخ", name_en: "Kibbeh Labanieh", desc_en: "3 Kibbeh balls + 1 cup Cooked Yogurt", cal: 550, macros: { p: 25, f: 30, c: 45 }, tags: ["gluten", "lactose"] },
            { name_ar: "ملوخية ودجاج", desc_ar: "1 كوب ملوخية + 5 ملاعق رز + دجاج", name_en: "Molokhia", desc_en: "1 cup Molokhia + 5 tbsp Rice + Chicken", cal: 450, macros: { p: 35, f: 12, c: 50 }, tags: ["gluten_free", "high-protein"] },
            { name_ar: "ورق عنب", desc_ar: "10 حبات (يلنجي) + سلطة زبادي", name_en: "Stuffed Grape Leaves", desc_en: "10 pcs (Vegetarian) + Yogurt Salad", cal: 350, macros: { p: 8, f: 14, c: 55 }, tags: ["vegan", "gluten_free"] },
            { name_ar: "دجاج محشي", desc_ar: "نصف صدر دجاج محشي فريك (3 ملاعق)", name_en: "Stuffed Chicken", desc_en: "1/2 Stuffed Chicken Breast (3 tbsp Freekeh)", cal: 550, macros: { p: 45, f: 18, c: 45 }, tags: ["gluten", "high-protein"] },
            { name_ar: "سمك مشوي", desc_ar: "سمكة كاملة (300غ) + سلطة جرجير", name_en: "Grilled Fish", desc_en: "Whole Fish (300g) + Arugula Salad", cal: 400, macros: { p: 50, f: 18, c: 5 }, tags: ["gluten_free", "high-protein", "pescatarian"] },
            { name_ar: "يخنة بطاطا", desc_ar: "1 كوب يخنة بطاطا ولحم + 5 ملاعق رز", name_en: "Potato Stew", desc_en: "1 cup Potato & Meat Stew + 5 tbsp Rice", cal: 500, macros: { p: 25, f: 15, c: 60 }, tags: ["gluten_free"] },
            { name_ar: "بازيلاء وجزر", desc_ar: "1 كوب يخنة + 90غ لحم مفروم + رز", name_en: "Peas & Carrots", desc_en: "1 cup Stew + 90g Minced Meat + Rice", cal: 420, macros: { p: 25, f: 14, c: 48 }, tags: ["gluten_free"] },
            { name_ar: "كباب مشوي", desc_ar: "3 أسياخ كباب (200غ) + سلطة مشوية", name_en: "Grilled Kebab", desc_en: "3 Kebab Skewers (200g) + Grilled Salad", cal: 550, macros: { p: 40, f: 35, c: 10 }, tags: ["gluten_free", "high-protein"] },
            { name_ar: "شاورما صحن", desc_ar: "200غ شاورما (بدون خبز) + سلطة", name_en: "Shawarma Plate", desc_en: "200g Shawarma (No bread) + Salad", cal: 450, macros: { p: 35, f: 30, c: 8 }, tags: ["gluten_free", "high-protein"] },
            { name_ar: "معكرونة بولونيز", desc_ar: "1 كوب معكرونة مسلوقة + لحم مفروم", name_en: "Pasta Bolognese", desc_en: "1 cup Pasta + Minced Meat sauce", cal: 550, macros: { p: 25, f: 18, c: 70 }, tags: ["gluten"] },
            { name_ar: "فاهيتا دجاج", desc_ar: "200غ دجاج + فليفلة وبصل (بدون خبز)", name_en: "Chicken Fajita", desc_en: "200g Chicken + Peppers (No Bread)", cal: 400, macros: { p: 45, f: 15, c: 12 }, tags: ["gluten_free", "high-protein"] },
            { name_ar: "عدس بحامض", desc_ar: "1.5 كوب عدس وسلق + ليمون", name_en: "Lemon Lentil Stew", desc_en: "1.5 cup Lentil & Chard + Lemon", cal: 350, macros: { p: 18, f: 8, c: 55 }, tags: ["vegan", "gluten_free"] },
            { name_ar: "ستيك لحم", desc_ar: "شريحة ستيك (150غ) + خضار سوتيه", name_en: "Steak & Veggies", desc_en: "150g Steak + Sautéed Veggies", cal: 500, macros: { p: 40, f: 32, c: 10 }, tags: ["gluten_free", "high-protein"] },
            { name_ar: "كبسة دجاج", desc_ar: "قطعة دجاج + 6 ملاعق رز بسمتي", name_en: "Chicken Kabsa", desc_en: "1 Chicken piece + 6 tbsp Basmati Rice", cal: 600, macros: { p: 35, f: 22, c: 68 }, tags: ["gluten_free", "high-protein"] },
            { name_ar: "كشري", desc_ar: "1 كوب كشري + صلصة طماطم", name_en: "Koshary", desc_en: "1 cup Koshary + Tomato Sauce", cal: 550, macros: { p: 15, f: 12, c: 90 }, tags: ["vegan", "gluten"] },
            { name_ar: "صينية خضار", desc_ar: "خضار مشكلة بالفرن + صدر دجاج", name_en: "Roasted Veggies", desc_en: "Oven roasted veggies + Chicken Breast", cal: 400, macros: { p: 35, f: 14, c: 25 }, tags: ["gluten_free", "high-protein"] },
            { name_ar: "داوود باشا", desc_ar: "كرات لحم بصلصة طماطم + رز", name_en: "Dawood Basha", desc_en: "Meatballs in Tomato Sauce + Rice", cal: 550, macros: { p: 30, f: 28, c: 45 }, tags: ["gluten_free", "high-protein"] },
            { name_ar: "كوسا محشي", desc_ar: "3 حبات كوسا (لحم ورز)", name_en: "Stuffed Zucchini", desc_en: "3 Zucchinis (Meat & Rice)", cal: 450, macros: { p: 20, f: 18, c: 55 }, tags: ["gluten_free"] },
            { name_ar: "فريكة دجاج", desc_ar: "1 كوب فريكة + صدر دجاج", name_en: "Freekeh Chicken", desc_en: "1 cup Freekeh + Chicken Breast", cal: 500, macros: { p: 40, f: 12, c: 55 }, tags: ["gluten", "high-protein"] },
            { name_ar: "فاصوليا بيضاء", desc_ar: "يخنة فاصوليا بيضاء + رز", name_en: "White Bean Stew", desc_en: "White Bean Stew + Rice", cal: 420, macros: { p: 22, f: 10, c: 60 }, tags: ["gluten_free"] },
            { name_ar: "مقلوبة زهرة", desc_ar: "مقلوبة قرنبيط ولحم + رز", name_en: "Cauliflower Maqluba", desc_en: "Cauliflower & Meat Maqluba", cal: 580, macros: { p: 30, f: 25, c: 55 }, tags: ["gluten_free", "high-protein"] },
            { name_ar: "سمك حارة", desc_ar: "فيليه سمك بصوص حار + رز", name_en: "Spicy Fish (Harra)", desc_en: "Spicy Fish Fillet + Rice", cal: 520, macros: { p: 45, f: 20, c: 40 }, tags: ["gluten_free", "high-protein", "pescatarian"] },
            { name_ar: "يخنة سبانخ", desc_ar: "سبانخ مطبوخ مع لحم مفروم + رز", name_en: "Spinach Stew", desc_en: "Spinach Stew with Meat + Rice", cal: 450, macros: { p: 30, f: 18, c: 40 }, tags: ["gluten_free"] },
            { name_ar: "شيش برك", desc_ar: "10 حبات شيش برك + لبن", name_en: "Shish Barak", desc_en: "10 Meat Dumplings in Yogurt", cal: 600, macros: { p: 25, f: 28, c: 55 }, tags: ["gluten", "lactose"] }
        ],
        dinner: [
            { name_ar: "شوربة عدس", desc_ar: "1.5 كوب (350مل) + ليمون", name_en: "Lentil Soup", desc_en: "1.5 cups (350ml) + Lemon", cal: 290, macros: { p: 15, f: 6, c: 45 }, tags: ["vegan", "gluten_free"] },
            { name_ar: "سلطة حلوم", desc_ar: "3 شرائح حلوم + 2 كوب خضار", name_en: "Halloumi Salad", desc_en: "3 slices Halloumi + 2 cups Veggies", cal: 320, macros: { p: 18, f: 24, c: 10 }, tags: ["lactose", "gluten_free", "vegetarian"] },
            { name_ar: "تونا بالماء", desc_ar: "علبة صغيرة (ماء) + نصف كوب ذرة", name_en: "Tuna Salad", desc_en: "1 small Tuna can (water) + 1/2 cup Corn", cal: 250, macros: { p: 30, f: 2, c: 25 }, tags: ["gluten_free", "high-protein", "pescatarian"] },
            { name_ar: "متبل باذنجان", desc_ar: "4 ملاعق متبل + نصف رغيف صغير", name_en: "Baba Ganoush", desc_en: "4 tbsp Dip + 1/2 small Pita", cal: 280, macros: { p: 6, f: 18, c: 25 }, tags: ["vegan", "gluten"] },
            { name_ar: "زبادي وخيار", desc_ar: "علبة زبادي (170غ) + 2 خيار", name_en: "Yogurt Cucumber", desc_en: "1 Yogurt pot (170g) + 2 Cucumbers", cal: 180, macros: { p: 10, f: 6, c: 15 }, tags: ["lactose", "gluten_free", "vegetarian"] },
            { name_ar: "سلطة يونانية", desc_ar: "خضار + 30غ جبنة فيتا + زيتون", name_en: "Greek Salad", desc_en: "Veggies + 30g Feta + Olives", cal: 220, macros: { p: 8, f: 18, c: 10 }, tags: ["lactose", "gluten_free", "vegetarian"] },
            { name_ar: "أومليت فطر", desc_ar: "2 بيضة + نصف كوب فطر", name_en: "Mushroom Omelette", desc_en: "2 Eggs + 1/2 cup Mushrooms", cal: 240, macros: { p: 14, f: 18, c: 4 }, tags: ["gluten_free", "vegetarian"] },
            { name_ar: "فتوش", desc_ar: "صحن كبير + ربع رغيف محمص", name_en: "Fattoush", desc_en: "Large Salad + 1/4 Toasted Bread", cal: 200, macros: { p: 4, f: 10, c: 25 }, tags: ["gluten", "vegan"] },
            { name_ar: "صدر دجاج", desc_ar: "150غ مشوي + سلطة خضراء", name_en: "Grilled Chicken", desc_en: "150g Grilled Breast + Green Salad", cal: 300, macros: { p: 45, f: 8, c: 5 }, tags: ["gluten_free", "high-protein"] },
            { name_ar: "فول باللبن", desc_ar: "1 كوب فول + 2 ملعقة طحينة ولبن", name_en: "Foul with Yogurt", desc_en: "1 cup Fava + 2 tbsp Tahini/Yogurt", cal: 310, macros: { p: 16, f: 12, c: 35 }, tags: ["lactose", "gluten_free", "vegetarian"] },
            { name_ar: "سلطة سيزر", desc_ar: "100غ دجاج + خس + صوص خفيف", name_en: "Caesar Salad", desc_en: "100g Chicken + Lettuce + Light Sauce", cal: 350, macros: { p: 30, f: 20, c: 12 }, tags: ["gluten_free", "high-protein"] },
            { name_ar: "شوربة خضار", desc_ar: "2 كوب خضار مسلوقة (بدون دهن)", name_en: "Veggie Soup", desc_en: "2 cups Boiled Veggies (No Oil)", cal: 150, macros: { p: 4, f: 1, c: 30 }, tags: ["vegan", "gluten_free"] },
            { name_ar: "توست تونا", desc_ar: "1 توست أسمر + نصف علبة تونا", name_en: "Tuna Toast", desc_en: "1 Brown Toast + 1/2 Tuna Can", cal: 280, macros: { p: 22, f: 8, c: 28 }, tags: ["gluten", "pescatarian"] },
            { name_ar: "جبنة قريش", desc_ar: "1 كوب (200غ) + طماطم", name_en: "Cottage Cheese", desc_en: "1 cup (200g) + Tomato", cal: 200, macros: { p: 24, f: 8, c: 8 }, tags: ["lactose", "gluten_free", "vegetarian"] },
            { name_ar: "سلطة كينوا", desc_ar: "6 ملاعق كينوا + بقدونس ورمان", name_en: "Quinoa Salad", desc_en: "6 tbsp Quinoa + Parsley & Pomegranate", cal: 280, macros: { p: 8, f: 10, c: 38 }, tags: ["vegan", "gluten_free"] },
            { name_ar: "سلطة جرجير", desc_ar: "جرجير + بصل + سماق (بدون زيت)", name_en: "Arugula Salad", desc_en: "Arugula + Onion + Sumac (No Oil)", cal: 100, macros: { p: 3, f: 1, c: 15 }, tags: ["vegan", "gluten_free"] },
            { name_ar: "لبنة وخضار", desc_ar: "3 ملاعق لبنة + خيار وجزر", name_en: "Labneh Plate", desc_en: "3 tbsp Labneh + Cucumber & Carrots", cal: 180, macros: { p: 8, f: 12, c: 10 }, tags: ["lactose", "gluten_free", "vegetarian"] },
            { name_ar: "شوربة شوفان", desc_ar: "1 كوب شوربة شوفان ودجاج", name_en: "Oat & Chicken Soup", desc_en: "1 cup Oat & Chicken Soup", cal: 250, macros: { p: 15, f: 6, c: 35 }, tags: ["gluten", "high-protein"] },
            { name_ar: "بطاطا مشوية", desc_ar: "حبة متوسطة + ملعقة لبنة", name_en: "Baked Potato", desc_en: "Medium Potato + 1 tbsp Labneh", cal: 200, macros: { p: 6, f: 2, c: 45 }, tags: ["lactose", "gluten_free", "vegetarian"] },
            { name_ar: "سلطة تونا", desc_ar: "نصف علبة تونا + فاصوليا حمراء", name_en: "Tuna Bean Salad", desc_en: "1/2 Tuna Can + Red Kidney Beans", cal: 250, macros: { p: 25, f: 4, c: 28 }, tags: ["gluten_free", "high-protein"] },
            { name_ar: "سلطة شمندر", desc_ar: "شمندر مسلوق + جرجير + جوز", name_en: "Beetroot Salad", desc_en: "Boiled Beetroot + Roca + Walnuts", cal: 220, macros: { p: 5, f: 12, c: 25 }, tags: ["vegan", "gluten_free"] },
            { name_ar: "شوربة قرع", desc_ar: "كوب شوربة قرع (بدون كريمة)", name_en: "Pumpkin Soup", desc_en: "1 cup Pumpkin Soup (No Cream)", cal: 180, macros: { p: 4, f: 6, c: 30 }, tags: ["vegan", "gluten_free"] },
            { name_ar: "بطاطا حرة", desc_ar: "مكعبات بطاطا بالثوم والكزبرة (فرن)", name_en: "Batata Harra", desc_en: "Spicy Potatoes with Cilantro (Baked)", cal: 250, macros: { p: 4, f: 8, c: 40 }, tags: ["vegan", "gluten_free"] },
            { name_ar: "سلطة خرشوف", desc_ar: "خرشوف + ليمون + زيت زيتون", name_en: "Artichoke Salad", desc_en: "Artichoke Hearts + Lemon + Olive Oil", cal: 150, macros: { p: 6, f: 8, c: 15 }, tags: ["vegan", "gluten_free"] },
            { name_ar: "مجدرة باردة", desc_ar: "صحن مجدرة (بايت) مع لبن", name_en: "Cold Mujadara", desc_en: "Leftover Mujadara with Yogurt", cal: 350, macros: { p: 12, f: 8, c: 55 }, tags: ["lactose", "gluten_free", "vegetarian"] },
            { name_ar: "سلطة شاورما", desc_ar: "شاورما دجاج (بدون خبز) + خضار", name_en: "Shawarma Salad", desc_en: "Chicken Shawarma (No Bread) + Veggies", cal: 300, macros: { p: 30, f: 15, c: 8 }, tags: ["gluten_free", "high-protein"] },
            { name_ar: "ذرة مشوية", desc_ar: "عرنوس ذرة مشوي", name_en: "Grilled Corn", desc_en: "Whole Grilled Corn on the Cob", cal: 150, macros: { p: 5, f: 2, c: 30 }, tags: ["vegan", "gluten_free"] },
            { name_ar: "سلطة عدس", desc_ar: "عدس + طماطم + بقدونس", name_en: "Lentil Salad", desc_en: "Lentils + Tomato + Parsley", cal: 220, macros: { p: 14, f: 6, c: 35 }, tags: ["vegan", "gluten_free"] }
        ],
        snacks: [
            { name_ar: "تمر وجوز", desc_ar: "3 حبات تمر + 3 أنصاف جوز", name_en: "Dates & Walnuts", desc_en: "3 Dates + 3 Walnut halves", cal: 190, macros: { p: 3, f: 10, c: 25 }, tags: ["nuts", "vegan", "sugar", "gluten_free"] },
            { name_ar: "فواكه", desc_ar: "تفاحة متوسطة أو كوب فراولة", name_en: "Fruit", desc_en: "Medium Apple or 1 cup Strawberry", cal: 100, macros: { p: 1, f: 0, c: 25 }, tags: ["vegan", "sugar", "gluten_free"] },
            { name_ar: "حمص محمص", desc_ar: "نصف كوب حمص بالفرن", name_en: "Roasted Chickpeas", desc_en: "1/2 cup Oven Roasted Chickpeas", cal: 150, macros: { p: 7, f: 4, c: 22 }, tags: ["vegan", "gluten_free"] },
            { name_ar: "شوكولاتة داكنة", desc_ar: "مكعبين (20غ) 70% كاكاو", name_en: "Dark Chocolate", desc_en: "2 squares (20g) 70% Cocoa", cal: 110, macros: { p: 2, f: 8, c: 10 }, tags: ["sugar", "vegan", "gluten_free"] },
            { name_ar: "لوز ني", desc_ar: "15 حبة لوز غير مملح", name_en: "Raw Almonds", desc_en: "15 Raw Almonds (Unsalted)", cal: 170, macros: { p: 6, f: 15, c: 5 }, tags: ["nuts", "vegan", "gluten_free"] },
            { name_ar: "فشار", desc_ar: "3 أكواب (بدون زيت)", name_en: "Popcorn", desc_en: "3 cups Air-popped Popcorn", cal: 100, macros: { p: 3, f: 1, c: 20 }, tags: ["vegan", "gluten_free"] },
            { name_ar: "ترمس", desc_ar: "1 كوب ترمس مسلوق", name_en: "Lupini Beans", desc_en: "1 cup Boiled Lupini", cal: 110, macros: { p: 12, f: 3, c: 10 }, tags: ["vegan", "gluten_free"] },
            { name_ar: "لبن عيران", desc_ar: "1 كوب (250مل)", name_en: "Ayran", desc_en: "1 cup (250ml) Yogurt Drink", cal: 90, macros: { p: 6, f: 5, c: 8 }, tags: ["lactose", "gluten_free", "vegetarian"] },
            { name_ar: "تفاح وزبدة", desc_ar: "1 تفاحة + 1 ملعقة زبدة فول", name_en: "Apple & Peanut Butter", desc_en: "1 Apple + 1 tsp Peanut Butter", cal: 200, macros: { p: 4, f: 8, c: 28 }, tags: ["nuts", "vegan", "sugar", "gluten_free"] },
            { name_ar: "كعك أرز", desc_ar: "2 قطعة + شريحة جبنة", name_en: "Rice Cakes", desc_en: "2 Rice Cakes + 1 Cheese slice", cal: 140, macros: { p: 6, f: 5, c: 18 }, tags: ["lactose", "gluten_free", "vegetarian"] },
            { name_ar: "خيار وجزر", desc_ar: "2 خيار + 2 جزر مقطع", name_en: "Veggie Sticks", desc_en: "2 Cucumbers + 2 Carrots", cal: 60, macros: { p: 2, f: 0, c: 14 }, tags: ["vegan", "gluten_free"] },
            { name_ar: "كاجو ني", desc_ar: "10 حبات كاجو", name_en: "Raw Cashews", desc_en: "10 Raw Cashews", cal: 160, macros: { p: 5, f: 12, c: 8 }, tags: ["nuts", "vegan", "gluten_free"] },
            { name_ar: "بسكويت شوفان", desc_ar: "2 قطعة (دايجستف لايت)", name_en: "Oat Cookies", desc_en: "2 Digestive Light cookies", cal: 150, macros: { p: 2, f: 6, c: 22 }, tags: ["gluten", "sugar", "vegetarian"] },
            { name_ar: "موزة", desc_ar: "حبة متوسطة", name_en: "Banana", desc_en: "Medium Banana", cal: 100, macros: { p: 1, f: 0, c: 27 }, tags: ["vegan", "sugar", "gluten_free"] },
            { name_ar: "عصير برتقال", desc_ar: "كوب طازج (بدون سكر)", name_en: "Orange Juice", desc_en: "Fresh cup (No Sugar)", cal: 110, macros: { p: 2, f: 0, c: 26 }, tags: ["vegan", "sugar", "gluten_free"] },
            { name_ar: "بذور يقطين", desc_ar: "2 ملعقة طعام", name_en: "Pumpkin Seeds", desc_en: "2 tbsp Pumpkin Seeds", cal: 120, macros: { p: 7, f: 10, c: 3 }, tags: ["vegan", "gluten_free"] },
            { name_ar: "زبادي فواكه", desc_ar: "علبة صغيرة خالية الدسم", name_en: "Fruit Yogurt", desc_en: "Small Low-fat Yogurt", cal: 140, macros: { p: 8, f: 0, c: 25 }, tags: ["lactose", "sugar", "gluten_free"] },
            { name_ar: "سحلب", desc_ar: "نصف كوب (حليب خالي الدسم)", name_en: "Sahlab", desc_en: "1/2 cup (Skim Milk)", cal: 150, macros: { p: 6, f: 3, c: 25 }, tags: ["lactose", "sugar"] },
            { name_ar: "مهلبيبة", desc_ar: "نصف كوب (سكر خفيف)", name_en: "Muhallabia", desc_en: "1/2 cup (Light Sugar)", cal: 180, macros: { p: 5, f: 6, c: 28 }, tags: ["lactose", "sugar", "gluten_free"] },
            { name_ar: "بوظة عربية", desc_ar: "كرة واحدة (بدون فستق)", name_en: "Arabic Ice Cream", desc_en: "1 scoop (No Pistachios)", cal: 200, macros: { p: 4, f: 10, c: 22 }, tags: ["lactose", "sugar", "gluten_free"] },
            { name_ar: "تين مجفف", desc_ar: "2 حبة تين مجفف", name_en: "Dried Figs", desc_en: "2 Dried Figs", cal: 100, macros: { p: 1, f: 0, c: 26 }, tags: ["vegan", "sugar", "gluten_free"] },
            { name_ar: "بزر دوار الشمس", desc_ar: "2 ملعقة طعام (بدون ملح)", name_en: "Sunflower Seeds", desc_en: "2 tbsp (Unsalted)", cal: 160, macros: { p: 6, f: 14, c: 4 }, tags: ["vegan", "gluten_free", "nuts"] },
            { name_ar: "رمان", desc_ar: "كوب حب رمان", name_en: "Pomegranate Seeds", desc_en: "1 cup Pomegranate", cal: 140, macros: { p: 2, f: 2, c: 32 }, tags: ["vegan", "sugar", "gluten_free"] },
            { name_ar: "إدامامي", desc_ar: "كوب إدامامي (مسلوق)", name_en: "Edamame", desc_en: "1 cup Boiled Edamame", cal: 180, macros: { p: 18, f: 8, c: 15 }, tags: ["vegan", "gluten_free", "high-protein"] },
            { name_ar: "لوز أخضر", desc_ar: "15 حبة لوز أخضر (موسمي)", name_en: "Green Almonds", desc_en: "15 Green Almonds (Seasonal)", cal: 100, macros: { p: 4, f: 8, c: 4 }, tags: ["vegan", "gluten_free"] },
            { name_ar: "حلقوم", desc_ar: "قطعة صغيرة (راحة)", name_en: "Turkish Delight", desc_en: "1 Small Cube", cal: 60, macros: { p: 0, f: 0, c: 16 }, tags: ["vegan", "sugar", "gluten_free"] },
            { name_ar: "معمول بتمر", desc_ar: "حبة صغيرة", name_en: "Maamoul Date", desc_en: "1 small piece", cal: 180, macros: { p: 3, f: 8, c: 28 }, tags: ["sugar", "vegetarian"] },
            { name_ar: "شراب جلاب", desc_ar: "كوب (بدون سكر إضافي)", name_en: "Jallab Drink", desc_en: "1 cup (No added sugar)", cal: 150, macros: { p: 0, f: 0, c: 38 }, tags: ["vegan", "sugar", "gluten_free"] }
        ]
    }
};

// --- 2. CHATBOT ---
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

// --- 3. HEALTH CALCULATIONS ---
app.post("/api/calculate", (req, res) => {
    let { weight, height, age, gender, bf, activity, goal, diseases, injuries } = req.body;
    
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
    
    if (bf) {
        if (bf < 5) return res.json({ stop: true, message: "Input Error: Body Fat % is dangerously low (< 5%)." });
        if (bf > 60) return res.json({ stop: true, message: "Input Error: Body Fat % is suspiciously high (> 60%)." });
    }

    if (gender === 'male' && hasPCOS) {
        return res.json({ stop: true, message: "Error: Biological males cannot be selected with PCOS." });
    }
    if (a < 13) return res.json({ stop: true, message: "Sorry, you are too young for an automated plan." });
    if (a > 80) return res.json({ stop: true, message: "At your age, strict dieting isn't recommended." });
    if (h < 130) return res.json({ stop: true, message: "Height input is quite low (< 130cm)." });
    if (w < 40) return res.json({ stop: true, message: "Weight is quite low (<40kg)." });
    if (w > 130) return res.json({ stop: true, message: "Based on your weight (>130kg), we highly recommend consulting a healthcare professional." });

    // --- BMI & RESTRICTIONS (STRICT CHECK) ---
    const heightM = h / 100;
    const bmi = (w / (heightM * heightM)).toFixed(1);
    
    let warning_msg = null;
    let alerts = [];

    // STRICT RULE: If BMI is Normal (18.5 - 24.9) AND Goal is Cut -> Force Maintenance
    if (bmi >= 18.5 && bmi < 25 && goal === 'cut') {
        goal = 'maintain'; // OVERRIDE GOAL
        alerts.push("Goal adjusted to Maintenance (Your weight is already healthy)");
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

    // Apply Goal (using the potentially overridden 'goal')
    if (goal === 'cut') tdee -= 500;
    if (goal === 'bulk') tdee += 400;

    // Safety Floors
    if (gender !== 'male' && tdee < 1200) tdee = 1200;
    if (gender === 'male' && tdee < 1500) tdee = 1500;

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

    if (hasDisease) alerts.push("Chronic Condition (Consult Physician)");
    if (hasInjury) alerts.push("Workout Injury (Consult Coach/PT)");

    if (alerts.length > 0) {
        warning_msg = "⚠️ Notice: " + alerts.join(" & ") + ".";
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
        warning_msg,
        final_goal: goal // Send back the actual goal used
    });
});

// --- HELPER ---
function getMeals(category, count, allergies, diseases, targetCal) {
    const algs = Array.isArray(allergies) ? allergies : [];
    const dis = Array.isArray(diseases) ? diseases : [];
    
    let validMeals = mealDB["middle eastern"][category].filter(meal => {
        const mTags = meal.tags || [];
        if (algs.includes('nuts') && mTags.includes('nuts')) return false;
        if (algs.includes('gluten') && mTags.includes('gluten')) return false;
        if (algs.includes('lactose') && mTags.includes('lactose')) return false;
        if (dis.includes('diabetes') && mTags.includes('sugar')) return false;
        return true;
    });

    if(validMeals.length === 0) return []; 

    if(targetCal) {
        validMeals.sort((a, b) => Math.abs(a.cal - targetCal) - Math.abs(b.cal - targetCal));
        const topSlice = Math.max(1, Math.floor(validMeals.length * 0.7)); 
        validMeals = validMeals.slice(0, topSlice);
    }

    for (let i = validMeals.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [validMeals[i], validMeals[j]] = [validMeals[j], validMeals[i]];
    }

    let selected = [];
    for(let i=0; i<count; i++) {
        let originalMeal = validMeals[i % validMeals.length];
        let finalMeal = { ...originalMeal }; 
        
        // Ensure macros exist (fallback for old data)
        if (!finalMeal.macros) finalMeal.macros = { p: 0, f: 0, c: 0 };

        if (targetCal) {
            let ratio = targetCal / originalMeal.cal;
            finalMeal.cal = targetCal; 
            
            // Scale Macros
            finalMeal.macros = {
                p: Math.round(originalMeal.macros.p * ratio),
                f: Math.round(originalMeal.macros.f * ratio),
                c: Math.round(originalMeal.macros.c * ratio)
            };

            let ratioStr = ratio.toFixed(1);
            if (ratio > 1.1) {
                finalMeal.name_en += ` (x${ratioStr})`;
                finalMeal.name_ar += ` (x${ratioStr})`;
                finalMeal.desc_en += ` [Increase x${ratioStr}]`;
                finalMeal.desc_ar += ` [ضاعف x${ratioStr}]`;
            } else if (ratio < 0.9) {
                finalMeal.name_en += ` (x${ratioStr})`;
                finalMeal.name_ar += ` (x${ratioStr})`;
                finalMeal.desc_en += ` [Reduce x${ratioStr}]`;
                finalMeal.desc_ar += ` [قلل x${ratioStr}]`;
            }
        }
        selected.push(finalMeal);
    }
    return selected;
}

// --- 4. WEEK GENERATOR ---
app.post("/api/generate-week", (req, res) => {
    const { allergies, diseases, targets } = req.body;
    
    const breakfasts = getMeals('breakfast', 7, allergies, diseases, targets.breakfast);
    const lunches = getMeals('lunch', 7, allergies, diseases, targets.lunch);
    const dinners = getMeals('dinner', 7, allergies, diseases, targets.dinner);
    const snacks = getMeals('snacks', 7, allergies, diseases, targets.snacks);

    let weekPlan = {};
    for(let i=0; i<7; i++) {
        weekPlan[i] = {
            breakfast: breakfasts[i],
            lunch: lunches[i],
            dinner: dinners[i],
            snacks: snacks[i]
        };
    }
    res.json(weekPlan);
});

// --- 5. REGENERATE SINGLE ---
app.post("/api/regen-meal", (req, res) => {
    const { type, allergies, diseases, targetCalories } = req.body; 
    const selection = getMeals(type === 'snacks' ? 'snacks' : type, 1, allergies, diseases, targetCalories);
    res.json(selection[0]);
});

app.listen(PORT, () => console.log(`Nutri-AI active on port ${PORT}`));