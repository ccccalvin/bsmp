/**
 * Maps recipe-friendly product IDs to slugified IDs from the ingredients dataset.
 * When a recipe references e.g. "chicken_breast", the resolver looks up matching
 * slugified product names from ingredients.json.
 */
export const productAliases: Record<string, string[]> = {
  // ===== PROTEINS =====
  chicken_breast: [
    "woolworths_rspca_approved_chicken_breast_fillet",
    "woolworths_rspca_approved_chicken_breast_fillet_skinless_small",
    "macro_chicken_breast_fillets_free_range",
  ],
  chicken_thigh: [
    "woolworths_rspca_approved_chicken_thigh_fillet",
    "macro_free_range_chicken_thigh_fillet",
  ],
  beef_mince: [
    "woolworths_beef_mince",
    "woolworths_lean_beef_mince",
    "woolworths_heart_smart_extra_lean_beef_mince",
  ],
  lamb_mince: ["woolworths_lamb_mince"],
  pork_mince: [
    "woolworths_pork_mince",
    "woolworths_lean_pork_mince",
  ],
  eggs: [
    "woolworths_12_extra_large_cage_free_eggs",
    "sunny_queen_12_extra_large_free_range_eggs",
    "manning_valley_12_extra_large_free_range_eggs",
  ],
  canned_tuna: [
    "essentials_tuna_chunks_in_spring_water",
    "greenseas_tuna_chunks_in_springwater_chunk_in_spring_water",
    "sirena_tuna_in_oil_italian_style",
  ],
  tofu: ["macro_firm_tofu"],
  canned_chickpeas: [
    "woolworths_chickpeas",
    "annalisa_chickpeas",
    "edgell_australian_grown_chickpeas",
  ],
  canned_lentils: [
    "woolworths_lentils",
    "macro_organic_lentils",
  ],
  salmon: [
    "woolworths_frozen_salmon_fillets_skin_on",
    "woolworths_salmon_portions_skin_on",
    "woolworths_salmon_portions_skin_off",
    "woolworths_fresh_tasmanian_atlantic_skin_on_salmon_fillets",
  ],
  bacon: [
    "woolworths_shortcut_bacon",
    "d_orsogna_shortcut_bacon_from_the_deli",
  ],
  sausages: [
    "woolworths_10_beef_sausages",
    "woolworths_10_herb_garlic_beef_sausages",
  ],
  kidney_beans: [
    "woolworths_red_kidney_beans",
    "annalisa_beans_red_kidney",
  ],
  cannellini_beans: [
    "annalisa_beans_cannellini",
    "macro_organic_cannellini_beans",
  ],
  black_beans: [
    "woolworths_black_beans",
    "edgell_black_beans_plant_protein",
  ],

  // ===== CARBS =====
  jasmine_rice: [
    "essentials_long_grain_rice_long_grain",
    "woolworths_microwave_jasmine_rice",
    "sunrice_japanese_style_sushi_rice",
  ],
  pasta: [
    "essentials_pasta_penne",
    "woolworths_pasta_spirals",
    "barilla_pasta_penne_rigate_rigate_pasta_no_73",
  ],
  spaghetti: [
    "woolworths_pasta_spaghetti",
    "san_remo_spaghetti_pasta_no_5",
    "barilla_pasta_spaghetti_pasta_no_5",
  ],
  bread: [
    "katoomba_roti_bread",
  ],
  wraps: [
    "mission_original_tortillas",
    "old_el_paso_fajita_tortilla_wraps",
  ],
  tortillas: [
    "mission_original_tortillas",
    "old_el_paso_burrito_tortilla_jumbo_wraps_burrito",
    "old_el_paso_fajita_tortilla_wraps",
  ],
  oats: [
    "woolworths_australian_rolled_oats",
    "woolworths_quick_oats",
    "uncle_tobys_rolled_oats_traditional_porridge",
  ],
  instant_noodles: [
    "lantern_alley_thin_egg_noodles",
    "lantern_alley_singapore_noodles",
    "indomie_mi_goreng_instant_noodles",
  ],
  noodles: [
    "lantern_alley_thin_egg_noodles",
    "lantern_alley_singapore_noodles",
  ],
  potatoes: [
    "potato_white_washed",
    "woolworths_washed_potatoes_bag",
    "potato_red_washed",
  ],
  sweet_potato: [
    "sweet_potato_gold",
    "woolworths_gold_sweet_potatoes_bag",
  ],
  flour: [
    "essentials_plain_flour",
    "essentials_self_raising_flour",
  ],
  cornflour: ["essentials_cornflour"],

  // ===== VEGETABLES =====
  frozen_mixed_veg: [
    "woolworths_cook_stir_fry_mix_traditional_vegetables",
    "woolworths_cook_stir_fry_mix_rainbow_vegetables",
  ],
  frozen_broccoli: [
    "fresh_broccoli",
    "woolworths_washed_ready_to_cook_broccoli_florets",
  ],
  broccoli: [
    "fresh_broccoli",
    "woolworths_washed_ready_to_cook_broccoli_florets",
  ],
  onions: [
    "onion_brown",
    "woolworths_onion_brown_bag",
  ],
  garlic: [
    "woolworths_garlic_head",
    "woolworths_garlic_cloves",
  ],
  tomatoes: [
    "truss_tomatoes",
    "tomato_roma_red",
    "gourmet_tomato",
  ],
  canned_tomatoes: [
    "annalisa_diced_tomatoes",
    "annalisa_tomatoes_diced",
    "ardmona_crushed_vine_ripened_tomatoes",
  ],
  spinach: [
    "woolworths_baby_leaf_spinach",
    "woolworths_baby_leaf_spinach_spinach",
  ],
  capsicum: [
    "red_capsicum",
    "woolworths_capsicum_green",
    "capsicum_yellow",
  ],
  carrots: [
    "carrot_fresh",
    "woolworths_australian_grown_carrots",
  ],
  frozen_stir_fry_veg: [
    "woolworths_cook_stir_fry_mix_asian_style_vegetables",
    "woolworths_cook_stir_fry_mix_traditional_vegetables",
    "bright_crunchy_stir_fry_vegetables",
  ],
  banana: [
    "cavendish_bananas",
    "eat_later_cavendish_bananas",
  ],
  cucumber: [
    "lebanese_cucumbers",
    "woolworths_continental_cucumbers",
  ],
  mushrooms: [
    "mushrooms_cups_loose",
    "woolworths_white_cup_sliced_mushroom_punnet",
    "woolworths_mushroom_sliced",
  ],
  corn: [
    "corn_sweet",
    "woolworths_corn_sweet",
  ],
  avocado: [
    "avocado_shepard",
    "avocado_fresh",
  ],
  zucchini: [
    "fresh_zucchini_green",
  ],
  lettuce: [
    "iceberg_lettuce",
    "woolworths_cos_hearts_lettuce",
  ],
  spring_onion: [
    "spring_onion_bunch",
  ],
  celery: [
    "celery_fresh_whole",
    "woolworths_celery_sticks_punnet",
  ],
  pumpkin: [
    "woolworths_butternut_pumpkin_cut",
    "pumpkin_kent_cut",
  ],
  lemon: ["lemon_fresh"],
  lime: ["lime_fresh"],
  ginger: [
    "ginger_fresh",
    "gourmet_garden_paste_ginger",
  ],
  coriander: [
    "woolworths_fresh_herb_coriander_bunch",
    "gourmet_garden_paste_coriander",
  ],
  green_beans: [
    "beans_round",
    "mulgowie_green_beans_cleaned_cut",
  ],
  eggplant: ["fresh_eggplant"],

  // ===== DAIRY =====
  milk: [
    "woolworths_full_cream_milk",
    "woolworths_full_cream_long_life_milk_uht",
  ],
  greek_yogurt: [
    "woolworths_natural_greek_style_yoghurt",
    "chobani_fit_high_protein_greek_yogurt_pot_vanilla",
  ],
  cheese: [
    "woolworths_tasty_cheese_block",
    "woolworths_tasty_cheese_shredded",
    "bega_tasty_cheese_block_cheese",
  ],
  butter: [
    "westgold_salted_butter_butter",
    "devondale_butter_block_unsalted_butter",
    "western_star_salted_butter_block_butter_block",
  ],
  cream: [
    "bulla_cooking_cream",
  ],

  // ===== PANTRY =====
  vegetable_oil: [
    "woolworths_vegetable_oil",
    "woolworths_canola_oil",
  ],
  olive_oil: [
    "essentials_olive_oil",
    "cobram_estate_classic_extra_virgin_olive_oil",
  ],
  sesame_oil: [
    "chang_s_sesame_oil",
  ],
  sugar: [
    "essentials_white_sugar",
    "csr_white_sugar",
  ],
  coconut_milk: [
    "ayam_100_natural_coconut_milk",
  ],
  coconut_cream: [
    "ayam_100_natural_coconut_cream",
  ],
  peanut_butter: [
    "woolworths_smooth_peanut_butter",
    "bega_smooth_peanut_butter",
    "bega_crunchy_peanut_butter",
  ],
  honey: [
    "cloverdale_pure_honey_squeeze",
    "cloverdale_pure_honey_twist_squeeze",
    "capilano_100_pure_australian_honey_squeeze",
  ],
  pasta_sauce: [
    "dolmio_classic_tomato_with_basil_pasta_sauce",
    "dolmio_extra_bolognese_tomato_pasta_sauce",
    "leggo_s_bolognese_chunky_tomato_garlic_herbs_pasta_sauce",
  ],
  vinegar: [
    "essentials_white_vinegar",
    "the_australian_vinegar_co_balsamic_vinegar",
  ],
  rice_wine_vinegar: [
    "lantern_alley_rice_wine_vinegar",
  ],

  // ===== SPICES & SAUCES =====
  soy_sauce: [
    "kikkoman_soy_sauce_soy",
    "lantern_alley_light_soy_sauce",
    "lee_kum_kee_soy_sauce_premium",
  ],
  sweet_soy_sauce: [
    "abc_kecap_manis_sweet_soy_sauce",
  ],
  curry_paste: [
    "gourmet_chef_thai_green_curry_sauce",
  ],
  cumin: [
    "woolworths_cumin_ground_ground",
  ],
  paprika: [
    "woolworths_paprika_ground",
  ],
  tomato_paste: [
    "essentials_tomato_paste",
    "woolworths_tomato_paste",
    "mutti_tomato_paste_double_concentrate",
  ],
  sweet_chilli: [
    "woolworths_sweet_chilli_sauce",
  ],
  oyster_sauce: [
    "lantern_alley_oyster_sauce",
  ],
  garam_masala: [],
  turmeric: [],
  chilli_flakes: [
    "woolworths_chilli_flakes",
  ],
  taco_seasoning: [
    "old_el_paso_taco_spice_mix_taco_spice_mix",
    "la_mesita_taco_seasoning_mild",
  ],
  sesame_seeds: [
    "woolworths_sesame_seeds",
  ],
  mayo: [
    "praise_whole_egg_creamy_mayo",
    "kewpie_japanese_mayonnaise",
  ],
  breadcrumbs: [
    "woolworths_panko_bread_crumbs",
    "essentials_breadcrumbs",
  ],
};
