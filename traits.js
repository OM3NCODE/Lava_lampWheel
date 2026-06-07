// Preset Data Configurations specifically for Character Traits (Values and Layers)
const PRESETS = {
    char_traits: [
        // Backgrounds
        { id: 't1', value: 'Purple', color: '#a855f7', image: '', active: true, trait_type: 'Background' },
        { id: 't2', value: 'White', color: '#f8fafc', image: '', active: true, trait_type: 'Background' },
        { id: 't3', value: 'Orange', color: '#f97316', image: '', active: true, trait_type: 'Background' },
        { id: 't4', value: 'Neon Green', color: '#22c55e', image: '', active: true, trait_type: 'Background' },
        { id: 't5', value: 'TouchGrass', color: '#10b981', image: '', active: true, trait_type: 'Background' },
        { id: 't6', value: 'Blue', color: '#3b82f6', image: '', active: true, trait_type: 'Background' },
        { id: 't7', value: 'Purple Spray', color: '#d946ef', image: '', active: true, trait_type: 'Background' },

        // Background Elements
        { id: 't8', value: 'Matrix 1010', color: '#14b8a6', image: '', active: true, trait_type: 'Background Elements' },
        { id: 't9', value: 'Clouds', color: '#38bdf8', image: '', active: true, trait_type: 'Background Elements' },
        { id: 't10', value: 'Rainbow', color: '#ec4899', image: '', active: true, trait_type: 'Background Elements' },
        { id: 't11', value: 'ZigZag', color: '#f43f5e', image: '', active: true, trait_type: 'Background Elements' },

        // Behind Head Elements
        { id: 't12', value: 'Traffic Cone', color: '#f97316', image: '', active: true, trait_type: 'Behind Head Elements' },
        { id: 't13', value: 'Halo', color: '#eab308', image: '', active: true, trait_type: 'Behind Head Elements' },
        { id: 't14', value: 'Cereal Bowl', color: '#ec4899', image: '', active: true, trait_type: 'Behind Head Elements' },
        { id: 't15', value: 'Apple with Arrow', color: '#ef4444', image: '', active: true, trait_type: 'Behind Head Elements' },
        { id: 't16', value: 'Rainbow Chicken', color: '#d946ef', image: '', active: true, trait_type: 'Behind Head Elements' },
        { id: 't17', value: 'Wizard Hat', color: '#8b5cf6', image: 'assets/wizard_hat.png', active: true, trait_type: 'Behind Head Elements' },
        { id: 't18', value: 'Ice Cream Bowl', color: '#06b6d4', image: '', active: true, trait_type: 'Behind Head Elements' },

        // Hoodies
        { id: 't19', value: 'Bunny Animal', color: '#ec4899', image: '', active: true, trait_type: 'Hoodie' },
        { id: 't20', value: 'Cow Animal', color: '#f59e0b', image: '', active: true, trait_type: 'Hoodie' },
        { id: 't21', value: 'Tiger Animal', color: '#ea580c', image: '', active: true, trait_type: 'Hoodie' },
        { id: 't22', value: 'Bear Animal', color: '#b45309', image: '', active: true, trait_type: 'Hoodie' },
        { id: 't23', value: 'Black', color: '#1e293b', image: '', active: true, trait_type: 'Hoodie' },
        { id: 't24', value: 'Orange', color: '#f97316', image: '', active: true, trait_type: 'Hoodie' },
        { id: 't25', value: 'Purple', color: '#8b5cf6', image: '', active: true, trait_type: 'Hoodie' },
        { id: 't26', value: 'White', color: '#f8fafc', image: '', active: true, trait_type: 'Hoodie' },
        { id: 't27', value: 'Grey', color: '#64748b', image: '', active: true, trait_type: 'Hoodie' },
        { id: 't28', value: 'Pink', color: '#f472b6', image: '', active: true, trait_type: 'Hoodie' },
        { id: 't29', value: 'Touch Grass', color: '#10b981', image: '', active: true, trait_type: 'Hoodie' },

        // Hoodie Deco
        { id: 't30', value: 'IYKYK CFUCK', color: '#6366f1', image: '', active: true, trait_type: 'Hoodie Deco' },
        { id: 't31', value: 'Solana', color: '#d946ef', image: '', active: true, trait_type: 'Hoodie Deco' },
        { id: 't32', value: 'Gold Flakes', color: '#eab308', image: '', active: true, trait_type: 'Hoodie Deco' },
        { id: 't33', value: 'BrokieInu', color: '#84cc16', image: '', active: true, trait_type: 'Hoodie Deco' },
        { id: 't34', value: 'BTC', color: '#f59e0b', image: '', active: true, trait_type: 'Hoodie Deco' },
        { id: 't35', value: 'ShitHappens', color: '#b45309', image: '', active: true, trait_type: 'Hoodie Deco' },
        { id: 't36', value: 'Kosha', color: '#14b8a6', image: '', active: true, trait_type: 'Hoodie Deco' },
        { id: 't37', value: 'LFGO', color: '#ef4444', image: '', active: true, trait_type: 'Hoodie Deco' },
        { id: 't38', value: 'Pengwine', color: '#38bdf8', image: '', active: true, trait_type: 'Hoodie Deco' },
        { id: 't39', value: 'HAU', color: '#06b6d4', image: '', active: true, trait_type: 'Hoodie Deco' },
        { id: 't40', value: '$VAI', color: '#d946ef', image: '', active: true, trait_type: 'Hoodie Deco' },
        { id: 't41', value: 'LFGO Logo', color: '#f43f5e', image: '', active: true, trait_type: 'Hoodie Deco' },
        { id: 't42', value: 'Pink Sprinkles', color: '#ec4899', image: '', active: true, trait_type: 'Hoodie Deco' },
        { id: 't43', value: '$SOAP', color: '#a855f7', image: '', active: true, trait_type: 'Hoodie Deco' },

        // Faces
        { id: 't44', value: 'Yellow', color: '#eab308', image: '', active: true, trait_type: 'Face' },
        { id: 't45', value: 'Yellow with Pink Freckles', color: '#f59e0b', image: '', active: true, trait_type: 'Face' },
        { id: 't46', value: 'Yellow with Blue Freckles', color: '#eab308', image: '', active: true, trait_type: 'Face' },
        { id: 't47', value: 'Yellow with Pink Freckles 2', color: '#eab308', image: '', active: true, trait_type: 'Face' },
        { id: 't48', value: 'Yellow with Purple Freckles', color: '#eab308', image: '', active: true, trait_type: 'Face' },
        { id: 't49', value: 'Grey', color: '#64748b', image: '', active: true, trait_type: 'Face' },
        { id: 't50', value: 'Grey with Pink Freckles', color: '#94a3b8', image: '', active: true, trait_type: 'Face' },
        { id: 't51', value: 'Grey with Blue Freckles', color: '#64748b', image: '', active: true, trait_type: 'Face' },
        { id: 't52', value: 'Grey with Pink Freckles 2', color: '#64748b', image: '', active: true, trait_type: 'Face' },
        { id: 't53', value: 'Grey with Purple Freckles', color: '#64748b', image: '', active: true, trait_type: 'Face' },
        { id: 't54', value: 'Green', color: '#22c55e', image: '', active: true, trait_type: 'Face' },
        { id: 't55', value: 'Green with Pink Freckles', color: '#10b981', image: '', active: true, trait_type: 'Face' },
        { id: 't56', value: 'Green with Blue Freckles', color: '#22c55e', image: '', active: true, trait_type: 'Face' },
        { id: 't57', value: 'Green with Pink Freckles 2', color: '#22c55e', image: '', active: true, trait_type: 'Face' },
        { id: 't58', value: 'Green with Purple Freckles', color: '#22c55e', image: '', active: true, trait_type: 'Face' },
        { id: 't59', value: 'Pink', color: '#ec4899', image: '', active: true, trait_type: 'Face' },
        { id: 't60', value: 'Pink with Blue Freckles', color: '#f472b6', image: '', active: true, trait_type: 'Face' },
        { id: 't61', value: 'Pink with Purple Freckles', color: '#ec4899', image: '', active: true, trait_type: 'Face' },
        { id: 't62', value: 'Purple', color: '#8b5cf6', image: '', active: true, trait_type: 'Face' },
        { id: 't63', value: 'Purple with Pink Freckles', color: '#a855f7', image: '', active: true, trait_type: 'Face' },
        { id: 't64', value: 'Purple with Blue Freckles', color: '#8b5cf6', image: '', active: true, trait_type: 'Face' },
        { id: 't65', value: 'Purple with Pink Freckles 2', color: '#8b5cf6', image: '', active: true, trait_type: 'Face' },
        { id: 't66', value: 'Blue', color: '#3b82f6', image: '', active: true, trait_type: 'Face' },
        { id: 't67', value: 'Blue with Pink Freckles', color: '#60a5fa', image: '', active: true, trait_type: 'Face' },
        { id: 't68', value: 'Blue with Pink Freckles 2', color: '#3b82f6', image: '', active: true, trait_type: 'Face' },
        { id: 't69', value: 'Blue with Purple Freckles', color: '#3b82f6', image: '', active: true, trait_type: 'Face' },

        // Tattoos
        { id: 't70', value: 'BTC Rune 1934', color: '#f59e0b', image: '', active: true, trait_type: 'Tattoo' },

        // Eyes
        { id: 't71', value: 'Angled Cute', color: '#6366f1', image: '', active: true, trait_type: 'Eyes' },
        { id: 't72', value: 'Blue Forward', color: '#3b82f6', image: '', active: true, trait_type: 'Eyes' },
        { id: 't73', value: 'Blue Lizard', color: '#06b6d4', image: '', active: true, trait_type: 'Eyes' },
        { id: 't74', value: 'Blue OG', color: '#38bdf8', image: '', active: true, trait_type: 'Eyes' },
        { id: 't75', value: 'Curved Cute', color: '#a855f7', image: '', active: true, trait_type: 'Eyes' },
        { id: 't76', value: 'Green Forward', color: '#22c55e', image: '', active: true, trait_type: 'Eyes' },
        { id: 't77', value: 'Green Lizard', color: '#10b981', image: '', active: true, trait_type: 'Eyes' },
        { id: 't78', value: 'Green OG', color: '#4ade80', image: 'assets/laser_eyes.png', active: true, trait_type: 'Eyes' },
        { id: 't79', value: 'Green with Blue Lizard', color: '#14b8a6', image: '', active: true, trait_type: 'Eyes' },
        { id: 't80', value: 'Pink Forward', color: '#ec4899', image: '', active: true, trait_type: 'Eyes' },
        { id: 't81', value: 'Pink Lizard', color: '#d946ef', image: '', active: true, trait_type: 'Eyes' },
        { id: 't82', value: 'Red Forward', color: '#f43f5e', image: '', active: true, trait_type: 'Eyes' },
        { id: 't83', value: 'Red Lizard', color: '#ef4444', image: '', active: true, trait_type: 'Eyes' },
        { id: 't84', value: 'Red OG', color: '#ef4444', image: '', active: true, trait_type: 'Eyes' },
        { id: 't85', value: 'Yellow Forward', color: '#eab308', image: '', active: true, trait_type: 'Eyes' },
        { id: 't86', value: 'Yellow Lizard', color: '#f59e0b', image: '', active: true, trait_type: 'Eyes' },
        { id: 't87', value: 'Yellow OG', color: '#eab308', image: '', active: true, trait_type: 'Eyes' },
        { id: 't88', value: 'Pink OG', color: '#f472b6', image: '', active: true, trait_type: 'Eyes' },

        // Headphones
        { id: 't89', value: 'Headphone', color: '#a855f7', image: 'assets/headphones.png', active: true, trait_type: 'Headphone' },

        // Mouths
        { id: 't90', value: 'Rainbow', color: '#ec4899', image: '', active: true, trait_type: 'Mouth' },
        { id: 't91', value: 'Golden', color: '#eab308', image: '', active: true, trait_type: 'Mouth' },
        { id: 't92', value: 'Joint', color: '#f59e0b', image: '', active: true, trait_type: 'Mouth' },
        { id: 't93', value: 'Pipe', color: '#6366f1', image: '', active: true, trait_type: 'Mouth' },
        { id: 't94', value: 'Green Kazoo', color: '#22c55e', image: '', active: true, trait_type: 'Mouth' },
        { id: 't95', value: 'Pink Kazoo', color: '#ec4899', image: '', active: true, trait_type: 'Mouth' },
        { id: 't96', value: 'Blue Kazoo', color: '#3b82f6', image: '', active: true, trait_type: 'Mouth' },
        { id: 't97', value: 'OG', color: '#f43f5e', image: '', active: true, trait_type: 'Mouth' },

        // Ear Outers
        { id: 't98', value: 'Grey', color: '#64748b', image: '', active: true, trait_type: 'Ear Outer' },
        { id: 't99', value: 'Neon Green', color: '#22c55e', image: '', active: true, trait_type: 'Ear Outer' },
        { id: 't100', value: 'Purple', color: '#8b5cf6', image: '', active: true, trait_type: 'Ear Outer' },
        { id: 't101', value: 'Yellow', color: '#eab308', image: '', active: true, trait_type: 'Ear Outer' },
        { id: 't102', value: 'Pink', color: '#ec4899', image: '', active: true, trait_type: 'Ear Outer' },
        { id: 't103', value: 'Blue', color: '#3b82f6', image: '', active: true, trait_type: 'Ear Outer' },

        // Ear Inners
        { id: 't104', value: 'Pink', color: '#f472b6', image: '', active: true, trait_type: 'Ear Inner' },
        { id: 't105', value: 'Neon Green', color: '#4ade80', image: '', active: true, trait_type: 'Ear Inner' },
        { id: 't106', value: 'Purple', color: '#a855f7', image: '', active: true, trait_type: 'Ear Inner' },
        { id: 't107', value: 'Blue', color: '#60a5fa', image: '', active: true, trait_type: 'Ear Inner' },

        // Neck and Ear Accessories
        { id: 't108', value: 'Nose Ring', color: '#eab308', image: '', active: true, trait_type: 'Neck and ear Accessories' },
        { id: 't109', value: 'Single Ear Rings', color: '#f59e0b', image: '', active: true, trait_type: 'Neck and ear Accessories' },
        { id: 't110', value: 'Multiple Ear Rings', color: '#eab308', image: '', active: true, trait_type: 'Neck and ear Accessories' },
        { id: 't111', value: 'Scarf', color: '#ec4899', image: '', active: true, trait_type: 'Neck and ear Accessories' },

        // OG_Chain
        { id: 't112', value: 'OG Chain', color: '#f59e0b', image: 'assets/gold_chain.png', active: true, trait_type: 'OG_Chain' },

        // Foreground Elements
        { id: 't113', value: 'ClusterFuck', color: '#06b6d4', image: '', active: true, trait_type: 'Forground elements' },
        { id: 't114', value: 'CFC Purple', color: '#8b5cf6', image: '', active: true, trait_type: 'Forground elements' },
        { id: 't115', value: 'CFC Blue', color: '#3b82f6', image: '', active: true, trait_type: 'Forground elements' },
        { id: 't116', value: 'CFC Yellow', color: '#eab308', image: '', active: true, trait_type: 'Forground elements' },
        { id: 't117', value: 'Byte', color: '#10b981', image: '', active: true, trait_type: 'Forground elements' },

        // Horns
        { id: 't118', value: 'Amethyst', color: '#d946ef', image: '', active: true, trait_type: 'Horns' },
        { id: 't119', value: 'Blue Flower', color: '#3b82f6', image: '', active: true, trait_type: 'Horns' },
        { id: 't120', value: 'Cactus', color: '#22c55e', image: '', active: true, trait_type: 'Horns' },
        { id: 't121', value: 'Cross Cross', color: '#8b5cf6', image: '', active: true, trait_type: 'Horns' },
        { id: 't122', value: 'Green Candle', color: '#10b981', image: '', active: true, trait_type: 'Horns' },
        { id: 't123', value: 'Lavalamp Blue', color: '#38bdf8', image: '', active: true, trait_type: 'Horns' },
        { id: 't124', value: 'Lavalamp Purple Blue', color: '#6366f1', image: '', active: true, trait_type: 'Horns' },
        { id: 't125', value: 'Lavalamp Purple Yellow', color: '#a855f7', image: '', active: true, trait_type: 'Horns' },
        { id: 't126', value: 'Lightbulb', color: '#eab308', image: '', active: true, trait_type: 'Horns' },
        { id: 't127', value: 'Orange Flower', color: '#f97316', image: '', active: true, trait_type: 'Horns' },
        { id: 't128', value: 'Pengwine Bottle Pink', color: '#ec4899', image: '', active: true, trait_type: 'Horns' },
        { id: 't129', value: 'Pengwine Bottle Purple', color: '#8b5cf6', image: '', active: true, trait_type: 'Horns' },
        { id: 't130', value: 'Pengwine Bottle Rainbow', color: '#d946ef', image: '', active: true, trait_type: 'Horns' },
        { id: 't131', value: 'Plunger', color: '#ef4444', image: '', active: true, trait_type: 'Horns' },
        { id: 't132', value: 'Polka Dots Green', color: '#22c55e', image: '', active: true, trait_type: 'Horns' },
        { id: 't133', value: 'Polka Dots Pink', color: '#f472b6', image: '', active: true, trait_type: 'Horns' },
        { id: 't134', value: 'Purple Flower', color: '#a855f7', image: '', active: true, trait_type: 'Horns' },
        { id: 't135', value: 'Quartz', color: '#06b6d4', image: '', active: true, trait_type: 'Horns' },
        { id: 't136', value: 'Rocket', color: '#ef4444', image: '', active: true, trait_type: 'Horns' },
        { id: 't137', value: 'Spiral', color: '#10b981', image: '', active: true, trait_type: 'Horns' },
        { id: 't138', value: 'Unicorn Fart', color: '#f472b6', image: '', active: true, trait_type: 'Horns' },
        { id: 't139', value: 'Up Only', color: '#22c55e', image: '', active: true, trait_type: 'Horns' },

        // Sunglasses
        { id: 't140', value: 'Rainbow Glasses', color: '#f43f5e', image: '', active: true, trait_type: 'Sunglasses' },
        { id: 't141', value: 'Hearts', color: '#ec4899', image: '', active: true, trait_type: 'Sunglasses' },
        { id: 't142', value: 'LFGO', color: '#ef4444', image: '', active: true, trait_type: 'Sunglasses' },
        { id: 't143', value: 'Solana', color: '#d946ef', image: '', active: true, trait_type: 'Sunglasses' },
        { id: 't144', value: 'BTC', color: '#f59e0b', image: '', active: true, trait_type: 'Sunglasses' },

        // WGA_Shoulder
        { id: 't145', value: 'WGA Skull', color: '#ef4444', image: '', active: true, trait_type: 'WGA_Shoulder' },

        // Helmets
        { id: 't146', value: 'BASC Space Helmet', color: '#3b82f6', image: '', active: true, trait_type: 'Helmets' },
        { id: 't147', value: 'Degen Visor', color: '#eab308', image: 'assets/crown.png', active: true, trait_type: 'Helmets' }
    ],
    numbers: [
        { id: '1', value: 'Number 1', color: '#4ade80', image: '', active: true, trait_type: 'Number' },
        { id: '2', value: 'Number 2', color: '#4ade80', image: '', active: true, trait_type: 'Number' },
        { id: '3', value: 'Number 3', color: '#4ade80', image: '', active: true, trait_type: 'Number' },
        { id: '4', value: 'Number 4', color: '#4ade80', image: '', active: true, trait_type: 'Number' },
        { id: '5', value: 'Number 5', color: '#4ade80', image: '', active: true, trait_type: 'Number' },
        { id: '6', value: 'Number 6', color: '#4ade80', image: '', active: true, trait_type: 'Number' }
    ]
};
