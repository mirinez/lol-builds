const lolData = {
"champions": {
        "Teemo": {
            "icon": "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Teemo.png",
            "role": "Top",
            "starter": [
                {
                    "id": "dorans_ring",
                    "name": "Doran's Ring",
                    "icon": "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/1056.png",
                    "stats": [
                        "+18 Ability Power",
                        "+90 Health",
                        "Passive: Restore 1 mana/s, increased to 1.5/s for 10s after damaging an enemy champion. If you can't gain mana, heals for 45% of this value instead.",
                        "Passive: Basic attacks deal 5 bonus physical damage on-hit against minions."
                    ],
                    "description": "El inicio estándar en build AP. El AP extra y el maná hacen que el early poke sea más amenazante. Matchups equilibrados o favorables."
                },
                {
                    "id": "dorans_shield",
                    "name": "Doran's Shield",
                    "icon": "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/1054.png",
                    "stats": [
                        "+110 Health",
                        "+4 Health Regen / 5 sec",
                        "Passive: After taking damage from a champion, gain 0–40 HP regeneration over 8s (scaled by missing health). 66% effective for ranged champions or when triggered by AoE, DoT, or proc.",
                        "Passive: Basic attacks deal 5 bonus physical damage on-hit against minions."
                    ],
                    "description": "Inicio defensivo para matchups duros donde me van a hacer mucho daño (Darius, Fiora, Renekton). La curación pasiva me permite quedarme en lane y farmear sin perder mucha vida."
                },
                {
                    "id": "dark_seal",
                    "name": "Dark Seal",
                    "icon": "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/1082.png",
                    "stats": [
                        "+15 Ability Power",
                        "+50 Health",
                        "Passive: Gain 2 stacks per champion kill and 1 per assist, up to 10 stacks. Each stack grants +4 AP (up to +40 AP). Lose 5 stacks on death. Stacks are preserved when upgrading to Mejai's Soulstealer."
                    ],
                    "description": "Solo si voy a intentar snowball agresivo desde el nivel 1. Si consigo las primeras cargas rápido, se convierte en Mejai's y el AP escala exageradamente."
                }
            ],
            "first_item": [
                {
                    "id": "liandry",
                    "name": "Liandry's Torment",
                    "icon": "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/6653.png",
                    "stats": [
                        "+60 Ability Power",
                        "+300 Health",
                        "Passive Torment: Dealing ability damage burns enemies for 1% of their max HP magic damage every 0.5s over 3s (6% total). Capped at 20 per tick against monsters.",
                        "Passive Suffering: For each second in combat with enemy champions, deal 2% increased damage, stacking up to 3 times (6% max)."
                    ],
                    "description": "Diría que es el item que mejor funciona con teemo. El DoT de % de vida se aplica con cada auto (por el veneno) y con cada seta. Perfecto contra tanques (pero no es anticuras)."
                },
                {
                    "id": "nashors_tooth",
                    "name": "Nashor's Tooth",
                    "icon": "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3115.png",
                    "stats": [
                        "+80 Ability Power",
                        "+50% Attack Speed",
                        "+15 Ability Haste",
                        "Passive Icathian Bite: Basic attacks deal 15 (+ 25% AP) bonus magic damage on-hit."
                    ],
                    "description": "Da velocidad de ataque + AP y su pasiva hace que los ataques básicos inflijan daño mágico adicional basado en tu AP. Junto con el veneno hacemos daño sostenido. Buildeo esto cuando el equipo enemigo tiene squishies o cuando quiero splitpush, es decir, para poder farmear rápido y aguantar peleas 1v1 sin perder mucha vida."
                },
                {
                    "id": "malignance",
                    "name": "Malignance",
                    "icon": "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3118.png",
                    "stats": [
                        "+90 Ability Power",
                        "+600 Mana",
                        "+15 Ability Haste",
                        "Passive Hatefog: Dealing damage with your ultimate ability creates a scorched zone beneath the target for 3s, dealing 15 (+ 1.25% AP) magic damage every 0.25s (180 + 15% AP total) and reducing their Magic Resistance by 10 (3s cooldown per target)."
                    ],
                    "description": "Reduce bastante el cooldown de la ultimate (las setas). Más setas = más control de zonas = más información. Además, reduce la resistencia mágica del enemigo. Lo compro cuando el equipo enemigo tiene mucho daño mágico o cuando quiero abusar del control de zonas con las setas."
                }
            ],
            "second_item": [
                {
                    "id": "shadowflame",
                    "name": "Shadowflame",
                    "icon": "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/4645.png",
                    "stats": [
                        "+110 Ability Power",
                        "+15 Magic Penetration",
                        "Passive Cinderbloom: Damage against champions benefits from +15 flat magic penetration, increasing as the target's current health is lower (maximum value at ≤40% HP). Also increases instances of damage that already critically strike by 20%."
                    ],
                    "description": "AP + penetración mágica condicional. Ineficaz cuando el equipo enemigo se empieza a stackear resistencia mágica, pero muy fuerte si soy el único AP de mi equipo y el enemigo no se hace MR."
                },
                {
                    "id": "blackfire_torch",
                    "name": "Blackfire Torch",
                    "icon": "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/2503.png",
                    "stats": [
                        "+80 Ability Power",
                        "+600 Mana",
                        "+20 Ability Haste",
                        "Passive Baleful Blaze: Dealing ability damage burns enemies for 10 (+ 1% AP) magic damage every 0.5s over 3s (60 + 6% AP total).",
                        "Passive Blackfire: For each champion, epic monster, or large monster afflicted with Baleful Blaze's burn, gain +4% AP (stacks per target)."
                    ],
                    "description": "Daño de % de vida adicional que se acumula con el Liandry. Por cada campeón o monstruo quemado, ganas un 4% de Poder de Habilidad (AP) adicional. A parte te da un +20 de Ability Haste. Necesario si el equipo enemigo tiene 2 o más tanques."
                },
                {
                    "id": "dusk_and_dawn",
                    "name": "Dusk and Dawn",
                    "icon": "https://wiki.leagueoflegends.com/en-us/images/Dusk_and_Dawn_item.png?be79a",
                    "stats": [
                        "+70 Ability Power",
                        "+25% Attack Speed",
                        "+350 Health",
                        "+20 Ability Haste",
                        "Passive: After using an ability or summoner spell, your next basic attack applies on-hit effects twice (double-hit)."
                    ],
                    "description": "La pasiva de Dusk and Dawn hace que tu siguiente autoataque aplique efectos al golpear dos veces, activa su pasiva fácil con la w o la q antes de iniciar a pegar. El objeto otorga 70 de Poder de Habilidad (AP), 25% de Velocidad de Ataque, 300 de Vida y 20 de Aceleración de Habilidad."
                }
            ],
            "third_item": [
                {
                    "id": "void_staff",
                    "name": "Void Staff",
                    "icon": "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3135.png",
                    "stats": [
                        "+95 Ability Power",
                        "+40% Magic Penetration"
                    ],
                    "description": "Cuando los enemigos empiezan a comprar resistencia mágica (y siempre lo hacen de tercero en adelante). Tiene un 40% de penetración mágica y ese stat es una barbaridad. Ademas junto con el Liandry o Malignance, el Void hace que el daño por porcentaje de vida de estos objetos sea mucho más efectivo."
                },
                {
                    "id": "bloodletter's_curse",
                    "name": "Bloodletter's Curse",
                    "icon": "https://wiki.leagueoflegends.com/en-us/images/Bloodletter%27s_Curse_item.png?c79ca",
                    "stats": [
                        "+65 Ability Power",
                        "+400 Health",
                        "+15 Ability Haste",
                        "Passive Vile Decay: Dealing magic damage with abilities or passives to a champion applies a stack for 6s, up to 4 stacks (once per cast every 0.3s). Each stack reduces their Magic Resistance by 7.5% (up to 30% at 4 stacks)."
                    ],
                    "description": "El veneno de la E y tus hongos aplican las acumulaciones de la pasiva de forma constante. A diferencia del Void, este objeto reduce la resistencia del objetivo para todos así que es muy bueno hacerselo cuando no eres el único AP del equipo. Además, el daño de % de vida adicional se aplica con cada acumulación, lo que lo hace muy fuerte con el Liandry."
                },
                {
                    "id": "zhonyas",
                    "name": "Zhonya's Hourglass",
                    "icon": "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3157.png",
                    "stats": [
                        "+105 Ability Power",
                        "+50 Armor",
                        "Active Stasis: Put yourself in stasis for 2.5s, becoming untargetable and invulnerable but unable to move, attack, or cast (120s cooldown)."
                    ],
                    "description": "No me suelo hacer esto con teemo al menos que me hagan focus en tf y por lo que sea mi equipo necesite mucho AP y yo sobrevivir a un all-in. A parte me otorga armadura, que es efectivo (Zed, Talon o Kha'Zix)."
                }
            ],
            "fourth_item": [
                {
                    "id": "rabadons",
                    "name": "Rabadon's Deathcap",
                    "icon": "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3089.png",
                    "stats": [
                        "+130 Ability Power",
                        "Passive Magical Opus: Increase your total Ability Power by 30% (multiplicative, applies recursively with other AP sources)."
                    ],
                    "description": "El Rabadon's multiplica el AP total por 1.30. Las setas pasan a ser one-shot en muchos casos. Solo si la partida está igualada o voy ganando."
                },
                {
                    "id": "riftmaker",
                    "name": "Riftmaker",
                    "icon": "https://wiki.leagueoflegends.com/en-us/images/Riftmaker_item.png?88dc9",
                    "stats": [
                        "+70 Ability Power",
                        "+350 Health",
                        "+15 Ability Haste",
                        "Passive Void Corruption: For each second in combat with champions, deal 2% increased damage, stacking up to 4 times (8% max). While fully stacked, gain Omnivamp (10% melee / 6% ranged).",
                        "Passive Void Infusion: Gain AP equal to 2% of your bonus Health."
                    ],
                    "description": "Perfecto para peleas largas. Ideal para peleas contra campeones como Mundo, Cho o Sion, ya que este item da aguante y daño sostenido."
                },
                {
                    "id": "morellonomicon",
                    "name": "Morellonomicon",
                    "icon": "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3165.png",
                    "stats": [
                        "+75 Ability Power",
                        "+350 Health",
                        "+15 Ability Haste",
                        "Passive Grievous Wounds: Dealing magic damage to enemy champions inflicts 40% Grievous Wounds for 3s (reduces all healing received by 40%)."
                    ],
                    "description": "Obligatorio si el equipo enemigo tiene mucha curación: Soraka, Mundo, Aatrox, Sylas. La grieta de curación que aplica el veneno de Teemo con Morello activo es prácticamente permanente. El veneno de la e mantiene el efecto de heridas graves incluso después de que el enemigo deje de recibir daño."
                }
            ],
            "situational": [
                {
                    "id": "lich_bane",
                    "name": "Lich Bane",
                    "icon": "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3100.png",
                    "stats": [
                        "+100 Ability Power",
                        "+4% Move Speed",
                        "+10 Ability Haste",
                        "Passive Spellblade: After using an ability, your next basic attack within 10s gains +50% bonus attack speed and deals 75% base AD (+ 40% AP) bonus magic damage on-hit (1.5s cooldown, starts after the empowered attack lands)."
                    ],
                    "description": "La pasiva del Lich escala con un 40% de tu AP más un importante 4% de velocidad de movimiento. Es muy bueno para hacer splitpush más que nada porque activando su pasiva puedes tirar torres mucho más rápido. Esto solo si no hay muchos tanques en el equipo enemigo y si no necesito aguante extra, ya que el Lich no da ni vida ni resistencia."
                },
                {
                    "id": "wits_end",
                    "name": "Wit's End",
                    "icon": "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3091.png",
                    "stats": [
                        "+50% Attack Speed",
                        "+45 Magic Resistance",
                        "+20% Tenacity",
                        "Passive: Basic attacks deal 15–80 bonus magic damage on-hit (scales with champion level)."
                    ],
                    "description": "Está bien si sigue habiendo mucho MR y me oneshotean con ello (Evelynn, Syndra, Kassadin). Tiene sinergia con el diente de nasor ya que añade otro efecto de daño por impacto (on-hit). Además, me da algo de resistencia mágica y velocidad de ataque."
                },
                {
                    "id": "banshee_veil",
                    "name": "Banshee's Veil",
                    "icon": "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3102.png",
                    "stats": [
                        "+105 Ability Power",
                        "+40 Magic Resistance",
                        "Passive Annul: Grants a spell shield that blocks the next enemy ability. Refreshes after taking no damage from enemy champions for 40s."
                    ],
                    "description": "Es un escudo anti-hechizos, vital contra campeones como Malphite. Da bastante AP, por lo que es efectivo si tenemos late donde sí o sí necesitemos defendernos de un primer hechizo que nos hace oneshot."
                }
            ],
            "boots": [
                {
                    "id": "sorcerers_shoes",
                    "name": "Sorcerer's Shoes",
                    "icon": "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3020.png",
                    "stats": [
                        "+45 Move Speed",
                        "+12 Magic Penetration (flat, applied after percentage penetration)."
                    ],
                    "description": "Importante hacer solo si el enemigo no buildea MR. Lo poco que quita de penetración no merece la pena si el enemigo se va a hacer MR."
                },
                {
                    "id": "ionian_boots",
                    "name": "Ionian Boots of Lucidity",
                    "icon": "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3158.png",
                    "stats": [
                        "+45 Move Speed",
                        "+10 Ability Haste",
                        "+10 Summoner Spell Haste (reduces cooldown of D and F summoner spells)."
                    ],
                    "description": "Diría que es una de las mejores opciones con Teemo. El CDR extra + la reducción de cooldown de summoners es lo que suelo buscar con teemo."
                },
                {
                    "id": "plated_steelcaps",
                    "name": "Plated Steelcaps",
                    "icon": "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3047.png",
                    "stats": [
                        "+45 Move Speed",
                        "+25 Armor",
                        "Passive: Reduces all damage taken from basic attacks by 8% (applies before armor calculation)."
                    ],
                    "description": "(Tabis) Contra ADC o tops con mucho daño físico (Darius, Fiora, Tryndamere). La reducción del daño de autos básicos es enorme en los matchups donde me atacan constantemente y necesito aguantar en línea."
                },
                {
                    "id": "mercurys_threads",
                    "name": "Mercury's Treads",
                    "icon": "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3111.png",
                    "stats": [
                        "+45 Move Speed",
                        "+20 Magic Resistance",
                        "Passive: +30% Tenacity (reduces the duration of all crowd control except suppression, displacement, and stasis)."
                    ],
                    "description": "(Mercuris) Muy útiles contra stuns, roots o silences, del rollo Leona, Syndra, Sejuani, ya que reduce un +30% tenacity, que es lo que se ocupa de eso mismo. Lo que no son los levantamientos, empujones o supresiones (WW, Skarner, Malza). Las comparía solo para fases de línea bastante desfavorables rollo Yorick, Morde, e incluso Kennen."
                },
                {
                    "id": "boots_of_swiftness",
                    "name": "Boots of Swiftness",
                    "icon": "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3009.png",
                    "stats": [
                        "+55 Move Speed",
                        "Passive: Reduces the effectiveness of slows applied to you by 25%."
                    ],
                    "description": "Sinceramente me las haría solo con permaslows, campeones que vayan a tener mucho control sobre mí, o que lo necesiten para ganar la línea. (Nasus, Olaf, Singed, Trundle). Reduce un 25% la duración de los slows."
                }
            ]
        },
        "Ornn": {
            "icon": "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Ornn.png",
            "role": "Top",
            "starter": [
                {
                    "id": "dorans_shield",
                    "name": "Doran's Shield",
                    "icon": "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/1054.png",
                    "stats": [
                        "+110 Health",
                        "+4 Health Regen / 5 sec",
                        "Passive: After taking damage from a champion, gain 0–40 HP regeneration over 8s (scaled by missing health). 66% effective for ranged champions or when triggered by AoE, DoT, or proc.",
                        "Passive: Basic attacks deal 5 bonus physical damage on-hit against minions."
                    ],
                    "description": ""
                },
                {
                    "id": "refillable_potion",
                    "name": "Refillable Potion",
                    "icon": "https://wiki.leagueoflegends.com/en-us/images/Refillable_Potion_item.png?f3a1b",
                    "stats": [
                        "Passive: Holds up to 2 charges that refill upon visiting the shop.",
                        "Passive: Consumes a charge to restore 100 HP over 12 seconds."
                    ],
                    "description": "Comprar si me veo capaz de farmear los 3 primeros minions de la wave y luego me hago el escudo de doran en un arbusto."
                }
            ],
            "first_item": [
                {
                    "id": "unending_despair",
                    "name": "Unending Despair",
                    "icon": "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/2502.png",
                    "stats": [
                        "+15 Ability Haste",
                        "+400 Health",
                        "+50 Armor",
                        "Passive: While in combat with champions, deal 30 (+2% bonus HP) magic damage to nearby enemies and heal for 190% of the damage dealt every 7s"
                    ],
                    "description": ""
                },
                {
                    "id": "kaenic_rookern",
                    "name": "Kaenic Rookern",
                    "icon": "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/2504.png",
                    "stats": [
                        "+80 Magic Resistance",
                        "+400 Health",
                        "+15 Ability Haste",
                        "Passive: After not taking magic damage for 15s, gain a magic shield for 18% of your maximum HP."
                    ],
                    "description": ""
                },
                {
                    "id": "heartsteel",
                    "name": "Heartsteel",
                    "icon": "https://wiki.leagueoflegends.com/en-us/images/Heartsteel_item.png?be381",
                    "stats": [
                        "+900 Health",
                        "+100% Base Health Regeneration",
                        "Passive: Within 700 units of a champion, generate stacks over 3s. Your next basic attack consumes them to deal 70 (+6% max HP) bonus physical damage and grants permanent bonus HP equal to 8% of that amount (30s CD per target).",
                        "Passive: Gain 0% – 30% increased size based on maximum health."
                    ],
                    "description": ""
                },
                {
                    "id": "protoplasm_harness",
                    "name": "Protoplasm Harness",
                    "icon": "https://wiki.leagueoflegends.com/en-us/images/Protoplasm_Harness_item.png?2d12a",
                    "stats": [
                        "+20 Ability Haste",
                        "+600 Health",
                        "Passive: Taking damage that drops you below 30% HP grants 200–312 bonus HP and heals for 200–424 (+175% bonus Armor/MR) over 5s. Also grants 15% size, 10% MS, and 25% Tenacity (90s CD)."
                    ],
                    "description": ""
                }
            ],
            "second_item": [
                {
                    "id": "chain_vest",
                    "name": "Chain Vest",
                    "icon": "https://wiki.leagueoflegends.com/en-us/images/Chain_Vest_item.png?d4a35",
                    "stats": [
                        "+40 Armor"
                    ],
                    "description": ""
                },
                {
                    "id": "ruby_crystal",
                    "name": "Ruby Crystal",
                    "icon": "https://wiki.leagueoflegends.com/en-us/images/Ruby_Crystal_item.png?bf858",
                    "stats": [
                        "+150 Health"
                    ],
                    "description": ""
                },
                {
                    "id": "bramble_vest",
                    "name": "Bramble Vest",
                    "icon": "https://wiki.leagueoflegends.com/en-us/images/Bramble_Vest_item.png?47b72",
                    "stats": [
                        "+30 Armor",
                        "Passive: When struck by a basic attack, deal 10 magic damage to the attacker and, if they are a champion, inflict 40% Grievous Wounds for 3 seconds."
                    ],
                    "description": "Anti-curas"
                },
                {
                    "id": "warden_s_mail",
                    "name": "Warden's Mail",
                    "icon": "https://wiki.leagueoflegends.com/en-us/images/Warden%27s_Mail_item.png?2ac93",
                    "stats": [
                        "+40 Armor",
                        "Passive: Every first incoming instance of post-mitigation basic damage per cast is reduced by 15 (max 20% reduction per instance)."
                    ],
                    "description": "Anti-dps"
                },
                {
                    "id": "rejuvenation_bead",
                    "name": "Rejuvenation Bead",
                    "icon": "https://wiki.leagueoflegends.com/en-us/images/Rejuvenation_Bead_item.png?8103b",
                    "stats": [
                        "+100% Base Health Regeneration"
                    ],
                    "description": ""
                }
            ],
            "third_item": [
                {
                    "id": "abyssal_mask",
                    "name": "Abyssal Mask",
                    "icon": "https://wiki.leagueoflegends.com/en-us/images/Abyssal_Mask_item.png?2d12a",
                    "stats": [
                        "+15 Ability Haste",
                        "+45 Magic Resistance",
                        "+350 Health",
                        "Passive: Nearby enemy champions are cursed, increasing magic damage they take from all sources by 12%."
                    ],
                    "description": ""
                },
                {
                    "id": "force_of_nature",
                    "name": "Force of Nature",
                    "icon": "https://wiki.leagueoflegends.com/en-us/images/Force_of_Nature_item.png?36bff",
                    "stats": [
                        "+55 Magic Resistance",
                        "+400 Health",
                        "+4% Movement Speed",
                        "Passive: Taking magic damage or being immobilized grants a stack (max 8) for 7s. At max stacks, gain 70 bonus MR and 6% bonus MS."
                    ],
                    "description": ""
                },
                {
                    "id": "spirit_visage",
                    "name": "Spirit Visage",
                    "icon": "https://wiki.leagueoflegends.com/en-us/images/Spirit_Visage_item.png?3a1b2",
                    "stats": [
                        "+10 Ability Haste",
                        "+50 Magic Resistance",
                        "+400 Health",
                        "+100% Base Health Regeneration",
                        "Passive: Increases all healing, shielding, and HP regeneration received by 25%."
                    ],
                    "description": ""
                }
            ],
            "fourth_item": [
                {
                    "id": "randuins_omen",
                    "name": "Randuin's Omen",
                    "icon": "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3143.png",
                    "stats": [
                        "+350 Health",
                        "+75 Armor",
                        "Passive: Critical strikes deal 30% less damage to you.",
                        "Passive: Reduce incoming damage from basic attacks by up to 5 (+3.5 per 1000 max HP), capped at 20% of the attack's damage."
                    ],
                    "description": ""
                },
                {
                    "id": "jaks_ho",
                    "name": "Jak'Sho",
                    "icon": "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/6665.png",
                    "stats": [
                        "+45 Armor",
                        "+350 Health",
                        "+45 Magic Resistance",
                        "Passive: Gain 1 stack/s in combat with champions (max 5). At max stacks, increase bonus Armor and MR by 30% until end of combat."
                    ],
                    "description": ""
                },
                {
                    "id": "frozen_heart",
                    "name": "Frozen Heart",
                    "icon": "https://wiki.leagueoflegends.com/en-us/images/Frozen_Heart_item.png?5a6ce",
                    "stats": [
                        "+20 Ability Haste",
                        "+75 Armor",
                        "+400 Mana",
                        "Passive: Cripples the attack speed of nearby enemies by 20%."
                    ],
                    "description": ""
                },
                {
                    "id": "warmogs_armor",
                    "name": "Warmog's Armor",
                    "icon": "https://wiki.leagueoflegends.com/en-us/images/Warmog%27s_Armor_item.png?3a1b2",
                    "stats": [
                        "+1000 Health",
                        "+100% Base Health Regeneration",
                        "Passive: Grants Warmog's Heart if you have at least 2000 bonus HP.",
                        "Passive: Regenerate 1.5% max HP every 0.5s if no damage is taken for 8s (3s for non-champions).",
                        "Passive Warmog's Vitality: Gain bonus HP equal to 12% bonus HP from items."
                    ],
                    "description": ""
                }
            ],
            "situational": [
                {
                    "id": "dead_man_s_plate",
                    "name": "Dead Man's Plate",
                    "icon": "https://wiki.leagueoflegends.com/en-us/images/Dead_Man%27s_Plate_item.png?39161",
                    "stats": [
                        "+55 Armor",
                        "+350 Health",
                        "+4% Movement Speed",
                        "Passive: While moving, generates up to 100 stacks of Momentum, granting up to 20 bonus movement speed. Basic attacks consume all stacks to deal 0 – 40 (+0% – 100% base AD) bonus physical damage on-hit.",
                        "Passive: Gain 15% slow resist."
                    ],
                    "description": ""
                },
                {
                    "id": "titanic_hydra",
                    "name": "Titanic Hydra",
                    "icon": "https://wiki.leagueoflegends.com/en-us/images/Titanic_Hydra_item.png?bcdcc",
                    "stats": [
                        "+40 Attack Damage",
                        "+600 Health",
                        "Passive: Basic attacks deal (1% / 0.5%) max HP bonus physical damage on-hit, plus (3% / 1.5%) max HP physical damage to enemies in a cone.",
                        "Active: Next basic attack resets timer and deals (4% / 2%) max HP bonus physical damage to the target and (9% / 4.5%) max HP to nearby enemies (10s CD)."
                    ],
                    "description": ""
                },
                {
                    "id": "hollow_radiance",
                    "name": "Hollow Radiance",
                    "icon": "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/6664.png",
                    "stats": [
                        "+10 Ability Power",
                        "+40 Magic Resistance",
                        "+400 Health",
                        "Passive: Dealing or taking damage deals 15 (+1.75% bonus HP) magic damage/s to nearby enemies (increased by 25% vs minions).",
                        "Passive: Killing an enemy deals 60 (+3.5% bonus HP) magic damage in an area."
                    ],
                    "description": ""
                },
                {
                    "id": "knight_s_vow",
                    "name": "Knight's Vow",
                    "icon": "https://wiki.leagueoflegends.com/en-us/images/Knight%27s_Vow_item.png?5a5a0",
                    "stats": [
                        "+10 Ability Haste",
                        "+40 Armor",
                        "+200 Health",
                        "+100% Base Health Regeneration",
                        "Active: Designate an allied champion as Worthy to form a tether (60s CD; 1250 range).\",",
                        "Passive: While tethered and above 30% max HP, redirect 12% of the pre-mitigation damage taken by your ally to yourself. Additionally, heal for 10% of the post-mitigation damage your ally deals to champions."
                    ],
                    "description": ""
                }
            ],
            "boots": [
                {
                    "id": "plated_steelcaps",
                    "name": "Plated Steelcaps",
                    "icon": "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3047.png",
                    "stats": [],
                    "description": "(Tabis)"
                },
                {
                    "id": "mercurys_threads",
                    "name": "Mercury's Treads",
                    "icon": "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3111.png",
                    "stats": [],
                    "description": "(Mercuris)"
                }
            ]
        }
    },
    "categories": [
        {
            "key": "starter",
            "label": "Starter"
        },
        {
            "key": "first_item",
            "label": "Main item"
        },
        {
            "key": "second_item",
            "label": "Half Item"
        },
        {
            "key": "third_item",
            "label": "MR Item"
        },
        {
            "key": "fourth_item",
            "label": "Final Item"
        },
        {
            "key": "situational",
            "label": "Situational"
        },
        {
            "key": "boots",
            "label": "Boots"
        }
    ]
};
