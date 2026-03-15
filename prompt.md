#   
Here’s the clearer version of the idea, stripped of fluff and shaped into something you could actually build.  
  
**Core product idea**  
  
Build a **student budget meal planner** that recommends **cheap, realistic meals** by combining:  
    •    **live supermarket product data**  
    •    **user constraints**  
    •    **simple recipe generation**  
    •    **cost-per-meal optimisation**  
  
The app takes inputs like:  
    •    weekly budget  
    •    calorie target  
    •    protein target  
    •    cuisine preference  
    •    dietary restrictions  
    •    cooking skill  
    •    available equipment  
    •    number of meals needed  
  
Then it outputs:  
    •    a **meal plan**  
    •    matching **recipes**  
    •    an **ingredient list**  
    •    estimated **total cost**  
    •    cheapest supermarket options  
    •    optional **shopping list by store**  
  
⸻  
  
**Better framing of the problem**  
  
Students usually fail meal planning for 3 reasons:  
    1.    they do not know what to cook  
    2.    they do not know what is actually cheap right now  
    3.    they cannot optimise across nutrition, cost, and convenience  
  
So your app is solving:  
  
“Given a student’s goals and budget, generate the cheapest practical meal plan using currently available supermarket products.”  
  
That is the real value.  
  
⸻  
  
**Product vision**  
  
A user says:  
  
“I have $45 for 5 days, want high protein, low calorie, easy meals, and I like Asian food.”  
  
Your system returns:  
    •    5 breakfasts  
    •    5 lunches  
    •    5 dinners  
    •    2 snack options  
    •    exact ingredients  
    •    quantities  
    •    estimated spend  
    •    store suggestions  
    •    instructions  
  
Example output:  
    •    **Breakfast:** overnight oats with banana  
    •    **Lunch:** chicken fried rice  
    •    **Dinner:** tofu stir fry with rice  
    •    **Snack:** Greek yogurt  
  
Total estimated cost:  
**$42.80 at Woolworths**  
or  
**$39.60 at Aldi + Coles split**  
  
That is a useful product.  
  
⸻  
  
**Stronger project scope**  
  
Do **not** start by scraping every supermarket and generating infinite recipe complexity. That is how mediocre projects die.  
  
Start with an MVP.  
  
**MVP**  
  
Support:  
    •    1 or 2 supermarkets only  
    •    20–50 recipes  
    •    basic filters:  
    •    budget  
    •    calories  
    •    cuisine  
    •    vegetarian/non-vegetarian  
    •    cooking time  
    •    shopping list generation  
    •    simple weekly meal plan  
  
That is enough to prove the concept.  
  
⸻  
  
**System design**  
  
**1. User input layer**  
  
User enters:  
    •    budget per week  
    •    meals per day  
    •    calorie preference:  
    •    low calorie  
    •    balanced  
    •    high calorie  
    •    dietary preference:  
    •    vegetarian  
    •    halal  
    •    no dairy  
    •    high protein  
    •    cuisine:  
    •    Asian  
    •    Western  
    •    Indian  
    •    Mediterranean  
    •    difficulty:  
    •    very easy  
    •    medium  
    •    time per meal  
    •    pantry staples already owned  
  
That last one matters. If the user already has rice, oil, salt, soy sauce, your cost model changes a lot.  
  
⸻  
  
**2. Supermarket data layer**  
  
This collects product info from supermarkets.  
  
Data you want:  
    •    product name  
    •    brand  
    •    price  
    •    size  
    •    price per unit  
    •    availability  
    •    category  
    •    nutrition if available  
  
Relevant categories:  
    •    proteins  
    •    carbs  
    •    vegetables  
    •    pantry items  
    •    dairy  
    •    spices/sauces  
  
You then normalise the data into a clean internal structure.  
  
Example:  
  
{  
  "name": "Chicken Breast Fillets",  
  "store": "Woolworths",  
  "price": 12.50,  
  "weight_g": 1000,  
  "price_per_100g": 1.25,  
  "category": "protein"  
}  
  
  
⸻  
  
**3. Recipe database layer**  
  
You need a structured recipe library.  
  
Each recipe should include:  
    •    recipe name  
    •    cuisine  
    •    ingredients  
    •    quantity per serving  
    •    calories per serving  
    •    protein/carbs/fat  
    •    prep time  
    •    difficulty  
    •    tags:  
    •    low calorie  
    •    high protein  
    •    cheap  
    •    vegetarian  
    •    one-pan  
    •    meal prep friendly  
  
Example structure:  
  
{  
  "name": "Chicken Fried Rice",  
  "cuisine": "Asian",  
  "servings": 4,  
  "ingredients": [  
    {"item": "chicken breast", "quantity_g": 500},  
    {"item": "rice", "quantity_g": 300},  
    {"item": "frozen mixed vegetables", "quantity_g": 400},  
    {"item": "soy sauce", "quantity_ml": 50}  
  ],  
  "calories_per_serving": 520,  
  "protein_per_serving": 38,  
  "difficulty": "easy",  
  "cook_time_min": 20,  
  "tags": ["high protein", "meal prep", "cheap"]  
}  
  
Do not use raw text recipes as your primary format. Structured recipes are what makes optimisation possible.  
  
⸻  
  
**4. Matching engine**  
  
This is the actual brain.  
  
It should:  
    1.    filter recipes by user constraints  
    2.    map recipe ingredients to supermarket products  
    3.    calculate recipe cost  
    4.    rank recipes based on:  
    •    affordability  
    •    nutrition match  
    •    cuisine match  
    •    ease  
    5.    build a meal plan that stays within budget  
  
This can begin as simple weighted scoring.  
  
Example score:  
  
score =  
  affordability_weight  
+ nutrition_match_weight  
+ cuisine_match_weight  
+ ease_weight  
  
Later, you can make it more advanced with optimisation logic.  
  
⸻  
  
**5. Meal plan generator**  
  
Once recipes are ranked, generate a plan.  
  
Example logic:  
    •    choose cheapest valid breakfast repeated 5 times  
    •    choose 2 lunch recipes for rotation  
    •    choose 2 dinner recipes for rotation  
    •    add snack if budget allows  
  
This is important: **students do not need gourmet diversity**. Repetition is a feature, not a bug.  
  
Trying to generate 21 unique meals is stupid for MVP. Budget users usually want:  
    •    cheap  
    •    easy  
    •    repeatable  
  
⸻  
  
**6. Shopping list generator**  
  
Aggregate all selected recipe ingredients into one list.  
  
Then convert them into actual store items:  
    •    2kg rice  
    •    1kg chicken breast  
    •    1 frozen veg pack  
    •    1 dozen eggs  
  
Output:  
    •    grouped by supermarket  
    •    grouped by aisle/category  
    •    total expected spend  
  
⸻  
  
**Key product features**  
  
**Version 1**  
    •    user profile form  
    •    recipe filtering  
    •    supermarket price lookup  
    •    cost-per-serving calculation  
    •    weekly meal plan  
    •    shopping list  
  
**Version 2**  
    •    compare supermarkets  
    •    substitute ingredients automatically  
    •    pantry-aware planning  
    •    macro targeting  
    •    meal prep mode  
    •    “ultra-budget mode”  
    •    save favourite plans  
  
**Version 3**  
    •    AI-generated recipes from available products  
    •    dynamic substitutions when products are out of stock  
    •    seasonal pricing adjustments  
    •    personalised learning from previous choices  
  
⸻  
  
**Best technical architecture**  
  
**Frontend**  
  
Use:  
    •    React / Next.js  
  
Why:  
    •    easy form handling  
    •    good for dashboards  
    •    simple deployment  
  
**Backend**  
  
Use:  
    •    Python with FastAPI  
  
Why:  
    •    good for scraping/data processing  
    •    easy optimisation logic  
    •    easy recipe/nutrition computation  
  
**Database**  
  
Use:  
    •    PostgreSQL  
  
Store:  
    •    products  
    •    prices  
    •    recipes  
    •    users  
    •    meal plans  
  
**Scraping / data ingestion**  
  
Use:  
    •    Python scripts  
    •    scheduled jobs  
  
**Hosting**  
  
Use:  
    •    Vercel for frontend  
    •    Railway / Render / AWS for backend + DB  
  
⸻  
  
**Hard parts you need to think about**  
  
**1. Supermarket data access**  
  
This is the first real risk.  
  
If supermarkets do not provide public APIs, you may need scraping.  
That means:  
    •    anti-bot issues  
    •    unstable selectors  
    •    legal/terms considerations  
    •    frequent maintenance  
  
So architect your app with a **store adapter layer**.  
  
Example:  
    •    ColesAdapter  
    •    WoolworthsAdapter  
    •    AldiAdapter  
  
Each adapter returns standardised product data.  
  
That way, when one source breaks, your whole app does not collapse.  
  
⸻  
  
**2. Product-to-ingredient matching**  
  
This is harder than it looks.  
  
Recipe says:  
    •    “chicken breast”  
  
Store has:  
    •    “RSPCA Approved Chicken Breast Fillets 1kg”  
    •    “Chicken Breast Schnitzel”  
    •    “Chicken Thigh Fillets”  
  
You need decent matching rules.  
  
Start simple:  
    •    category match  
    •    keyword match  
    •    exclude bad substitutes  
  
Later:  
    •    use embeddings or fuzzy matching  
  
⸻  
  
**3. Cost realism**  
  
This is where weak projects become useless.  
  
A recipe might use:  
    •    20 ml soy sauce  
    •    1 tsp oil  
    •    1 garlic clove  
  
But users buy whole bottles and packs.  
  
So you need two cost models:  
  
**a) upfront shopping cost**  
  
Real amount the student must spend now  
  
**b) consumed cost**  
  
Theoretical per-serving ingredient usage cost  
  
Both matter.  
  
If your app only shows theoretical cost, it lies.  
  
⸻  
  
**4. Nutrition quality**  
  
If you let the optimiser chase only “cheap + low calorie,” it will produce garbage meals.  
  
You need guardrails like:  
    •    minimum protein  
    •    minimum vegetable coverage  
    •    reasonable calorie floor  
    •    ingredient diversity threshold  
  
Otherwise your app will suggest rice and eggs forever.  
  
⸻  
  
**Clean problem statement**  
  
You can describe the project like this:  
  
A web application that generates affordable, nutritionally aligned meal plans for students by combining supermarket pricing data, structured recipes, and user dietary preferences.  
  
That is much better than the original wording.  
  
⸻  
  
**Clear feature breakdown**  
  
**Inputs**  
    •    budget  
    •    calorie goal  
    •    protein goal  
    •    cuisine preference  
    •    dietary restrictions  
    •    cooking time  
    •    pantry items  
    •    servings  
  
**Processing**  
    •    fetch store prices  
    •    normalise product data  
    •    filter recipes  
    •    match ingredients to products  
    •    estimate total cost  
    •    optimise meal selection  
  
**Outputs**  
    •    weekly meal plan  
    •    recipes  
    •    shopping list  
    •    total spend  
    •    supermarket comparison  
  
⸻  
  
**Strong MVP roadmap**  
  
**Phase 1: proof of concept**  
    •    manually enter 30 recipes  
    •    manually import supermarket CSV/product data  
    •    simple recipe filtering  
    •    simple cost calculator  
  
Goal:  
prove users want this  
  
**Phase 2: automation**  
    •    scrape or ingest live supermarket data  
    •    auto-match ingredients to products  
    •    generate shopping lists  
    •    add user accounts  
  
**Phase 3: optimisation**  
    •    meal plan generation engine  
    •    multi-store comparison  
    •    pantry-aware cost reductions  
    •    macro-aware planning  
  
⸻  
  
**Example user journey**  
    1.    User opens app  
    2.    Sets:  
    •    budget = $50  
    •    calories = low  
    •    cuisine = Asian  
    •    protein = high  
    •    cooking time = under 25 min  
    3.    App checks supermarket products  
    4.    App filters valid recipes  
    5.    App scores cheapest suitable meals  
    6.    App builds 5-day plan  
    7.    App outputs:  
    •    meals  
    •    ingredients  
    •    store options  
    •    spend summary  
  
⸻  
  
**Better names for the project**  
  
Your current idea is functional but bland. Better names:  
    •    BudgetBite  
    •    StudentMealIQ  
    •    CheapChef  
    •    MealStack  
    •    UniEats Planner  
    •    FridgeFlow  
    •    SmartPantry  
    •    BudgetPlate  
  
⸻  
  
**Brutally honest product advice**  
  
The idea is good.  
  
But it becomes trash fast if you make it too broad.  
  
Bad version:  
    •    “AI app that makes recipes from supermarket data”  
  
That is vague, bloated, and undifferentiated.  
  
Good version:  
    •    “A student-focused meal planner that optimises for low cost, nutrition, and supermarket availability.”  
  
That is sharp.  
  
Your real moat is not recipe generation.  
Your moat is:  
    •    **price-aware planning**  
    •    **constraint-aware meal generation**  
    •    **practical student use case**  
  
That is what makes it strong.  
  
⸻  
  
**Final polished concept**  
  
**Project concept**  
  
A budget meal planning application for students that pulls current supermarket product and pricing data, then generates low-cost recipes and weekly meal plans based on user goals such as calorie target, cuisine preference, dietary restrictions, and spending limit.  
  
**Key value**  
  
It helps students answer:  
    •    what should I cook  
    •    what can I afford  
    •    where should I buy it  
    •    how do I stay on track nutritionally  
  
**MVP goal**  
  
Deliver a simple planner that recommends affordable meals, calculates ingredient costs from real supermarket products, and generates a shopping list within the user’s budget.  
  
If you want, I can turn this into a proper **software project spec** next: problem statement, features, architecture, database schema, and MVP milestone plan.  