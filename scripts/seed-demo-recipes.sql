-- Demo recipes with chef profiles
-- Run this via Supabase SQL editor or Management API

-- Get chef IDs first
DO $$
DECLARE
  catarina_id UUID;
  anette_id UUID;
BEGIN
  SELECT id INTO catarina_id FROM chefs WHERE slug = 'catarina-konig';
  SELECT id INTO anette_id FROM chefs WHERE slug = '56kilo';

  -- Catarina's recipes
  INSERT INTO recipes (
    title,
    description,
    image_url,
    chef_id,
    chef_name,
    chef_avatar_url,
    category,
    tags,
    difficulty,
    prep_time_minutes,
    cook_time_minutes,
    servings,
    suitable_for_lunch_box,
    is_fancy,
    ingredients,
    steps
  ) VALUES
  (
    'Krämig pasta carbonara',
    'Klassisk italiensk pastarätt med ägg, bacon och parmesan. Perfekt vardagsmiddag som går snabbt att laga.',
    'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=1200&h=800&fit=crop',
    catarina_id,
    'Catarina König',
    'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
    'varmrätt',
    ARRAY['snabb', 'enkel', 'italienskt', 'pasta'],
    'enkel',
    10,
    20,
    4,
    true,
    false,
    '[
      {"name": "Spaghetti", "amount": "400", "unit": "g"},
      {"name": "Bacon", "amount": "200", "unit": "g"},
      {"name": "Ägg", "amount": "4", "unit": "st"},
      {"name": "Parmesanost", "amount": "100", "unit": "g"},
      {"name": "Svartpeppar", "amount": "1", "unit": "tsk"},
      {"name": "Salt", "amount": "", "unit": "efter smak"}
    ]'::jsonb,
    '[
      {"order": 1, "instruction": "Koka spaghetti enligt anvisning på förpackningen.", "duration_minutes": 10},
      {"order": 2, "instruction": "Stek bacon tills den är krispig, ta bort från pannan och hacka grovt.", "duration_minutes": 5},
      {"order": 3, "instruction": "Vispa ihop ägg, riven parmesan och svartpeppar i en skål."},
      {"order": 4, "instruction": "När pastan är klar, häll av vattnet men spara 1 dl pastavatten."},
      {"order": 5, "instruction": "Blanda pastan med äggblandningen utanför värmen (annars blir äggen äggröra!)"},
      {"order": 6, "instruction": "Tillsätt lite pastavatten om det behövs för rätt konsistens."},
      {"order": 7, "instruction": "Vänd ner bacon och servera direkt med extra parmesan."}
    ]'::jsonb
  ),
  (
    'Nordisk laxsoppa',
    'Krämig och varmande laxsoppa med dill och potatis. En klassiker som värmer på kalla dagar.',
    'https://images.unsplash.com/photo-1551218372-ca24c58f1e5a?w=1200&h=800&fit=crop',
    catarina_id,
    'Catarina König',
    'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
    'varmrätt',
    ARRAY['nordiskt', 'soppa', 'fisk', 'comfort food'],
    'medel',
    15,
    30,
    4,
    false,
    false,
    '[
      {"name": "Lax", "amount": "400", "unit": "g"},
      {"name": "Potatis", "amount": "600", "unit": "g"},
      {"name": "Morot", "amount": "2", "unit": "st"},
      {"name": "Purjolök", "amount": "1", "unit": "st"},
      {"name": "Grädde", "amount": "3", "unit": "dl"},
      {"name": "Fiskfond", "amount": "5", "unit": "dl"},
      {"name": "Färsk dill", "amount": "1", "unit": "kruka"},
      {"name": "Smör", "amount": "50", "unit": "g"}
    ]'::jsonb,
    '[
      {"order": 1, "instruction": "Skala och skär potatis i bitar. Skär morot och purjolök."},
      {"order": 2, "instruction": "Fräs purjolök i smör tills den mjuknat.", "duration_minutes": 3},
      {"order": 3, "instruction": "Tillsätt potatis, morot och fiskfond. Koka upp och låt sjuda.", "duration_minutes": 15},
      {"order": 4, "instruction": "Skär laxen i bitar och lägg i soppan.", "duration_minutes": 5},
      {"order": 5, "instruction": "Tillsätt grädde och värm försiktigt. Smaka av med salt och peppar."},
      {"order": 6, "instruction": "Toppa med hackad dill och servera med gott bröd."}
    ]'::jsonb
  ),
  (
    'Kycklingwok med grönsaker',
    'Snabb och fräsch kycklingwok med massor av grönsaker. Perfekt vardagsmiddag!',
    'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=1200&h=800&fit=crop',
    catarina_id,
    'Catarina König',
    'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
    'varmrätt',
    ARRAY['snabb', 'asiatiskt', 'kyckling', 'wok'],
    'enkel',
    15,
    15,
    4,
    true,
    false,
    '[
      {"name": "Kycklingfilé", "amount": "500", "unit": "g"},
      {"name": "Broccoli", "amount": "1", "unit": "huvud"},
      {"name": "Paprika", "amount": "2", "unit": "st"},
      {"name": "Morot", "amount": "2", "unit": "st"},
      {"name": "Böngroddar", "amount": "200", "unit": "g"},
      {"name": "Sojasås", "amount": "3", "unit": "msk"},
      {"name": "Sesamolja", "amount": "1", "unit": "msk"},
      {"name": "Vitlök", "amount": "2", "unit": "klyftor"},
      {"name": "Ingefära", "amount": "1", "unit": "msk färsk"}
    ]'::jsonb,
    '[
      {"order": 1, "instruction": "Skär kycklingen i bitar och alla grönsaker i lagom stora bitar."},
      {"order": 2, "instruction": "Hetta upp woken eller en stor stekpanna med olja på hög värme."},
      {"order": 3, "instruction": "Stek kycklingen tills den fått färg.", "duration_minutes": 5},
      {"order": 4, "instruction": "Lägg i vitlök, ingefära och de hårdare grönsakerna (morot, broccoli).", "duration_minutes": 3},
      {"order": 5, "instruction": "Tillsätt paprika och böngroddar. Woká snabbt.", "duration_minutes": 2},
      {"order": 6, "instruction": "Häll i sojasås och sesamolja. Rör om och servera direkt med ris eller nudlar."}
    ]'::jsonb
  );

  -- Anette's Low-carb recipes
  INSERT INTO recipes (
    title,
    description,
    image_url,
    chef_id,
    chef_name,
    chef_avatar_url,
    category,
    tags,
    difficulty,
    prep_time_minutes,
    cook_time_minutes,
    servings,
    suitable_for_lunch_box,
    is_fancy,
    ingredients,
    steps
  ) VALUES
  (
    'LCHF Lasagne med squash',
    'Ljuvlig lasagne där pastan bytts ut mot tunna squashskivor. Lika gott, men mycket mer hälsosamt!',
    'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=1200&h=800&fit=crop',
    anette_id,
    '56kilo by Anette',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    'varmrätt',
    ARRAY['low-carb', 'lchf', 'squash', 'gratäng'],
    'medel',
    20,
    40,
    6,
    true,
    false,
    '[
      {"name": "Squash", "amount": "2", "unit": "st stora"},
      {"name": "Nötfärs", "amount": "600", "unit": "g"},
      {"name": "Krossade tomater", "amount": "400", "unit": "g"},
      {"name": "Crème fraiche", "amount": "3", "unit": "dl"},
      {"name": "Riven ost", "amount": "200", "unit": "g"},
      {"name": "Vitlök", "amount": "2", "unit": "klyftor"},
      {"name": "Oregano", "amount": "1", "unit": "tsk"},
      {"name": "Salt och peppar", "amount": "", "unit": ""}
    ]'::jsonb,
    '[
      {"order": 1, "instruction": "Sätt ugnen på 200°C."},
      {"order": 2, "instruction": "Skiva squashen tunt med mandolin eller skalare."},
      {"order": 3, "instruction": "Bryn färsen med vitlök. Tillsätt tomater och oregano. Koka ihop.", "duration_minutes": 10},
      {"order": 4, "instruction": "Varva squash, färssås, crème fraiche och ost i en ugnssäker form."},
      {"order": 5, "instruction": "Avsluta med ett generöst lager ost på toppen."},
      {"order": 6, "instruction": "Grädda i ugnen tills osten får fin färg.", "duration_minutes": 35}
    ]'::jsonb
  ),
  (
    'Keto-vänliga köttbullar',
    'Saftiga köttbullar utan ströbröd. Servera med gräddsås och blomkålsmos för fullständig keto-middag.',
    'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=1200&h=800&fit=crop',
    anette_id,
    '56kilo by Anette',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    'varmrätt',
    ARRAY['low-carb', 'keto', 'köttbullar', 'klassiker'],
    'enkel',
    15,
    20,
    4,
    true,
    false,
    '[
      {"name": "Nötfärs", "amount": "500", "unit": "g"},
      {"name": "Ägg", "amount": "1", "unit": "st"},
      {"name": "Mandelsmjöl", "amount": "2", "unit": "msk"},
      {"name": "Lök", "amount": "0.5", "unit": "st finhackad"},
      {"name": "Grädde", "amount": "2", "unit": "dl"},
      {"name": "Buljong", "amount": "2", "unit": "dl"},
      {"name": "Soja", "amount": "1", "unit": "msk"},
      {"name": "Smör", "amount": "", "unit": "till stekning"}
    ]'::jsonb,
    '[
      {"order": 1, "instruction": "Blanda färs, ägg, mandelsmjöl, lök, salt och peppar. Rulla till bullar."},
      {"order": 2, "instruction": "Bryn köttbullarna i smör tills de fått fin färg runt om.", "duration_minutes": 8},
      {"order": 3, "instruction": "Ta upp köttbullarna. Häll i grädde och buljong i pannan."},
      {"order": 4, "instruction": "Lägg tillbaka köttbullarna och låt sjuda i såsen.", "duration_minutes": 10},
      {"order": 5, "instruction": "Smaka av med soja, salt och peppar."},
      {"order": 6, "instruction": "Servera med blomkålsmos eller zucchininudlar!"}
    ]'::jsonb
  );

  -- Update chef recipe counts
  UPDATE chefs SET recipe_count = 3 WHERE slug = 'catarina-konig';
  UPDATE chefs SET recipe_count = 2 WHERE slug = '56kilo';

END $$;
