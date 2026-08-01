#!/usr/bin/env python3
"""Turn data/vocab-source.txt into data/vocab.json + CORRECTIONS.md.

The source file is the study list exactly as it was written by hand, so it
carries a few wrong articles, typos and duplicate entries. Rather than editing
the list in place and losing the record, every change lives in CORRECTIONS
below and gets written out to CORRECTIONS.md for review.

Run:  python3 tools/build-vocab.py
"""

import io
import json
import os
import re
import unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "data", "vocab-source.txt")
OUT = os.path.join(ROOT, "data", "vocab.json")
CORR = os.path.join(ROOT, "CORRECTIONS.md")

# ---------------------------------------------------------------- corrections
# index -> (new_fr | None, new_en | None, reason)
CORRECTIONS = {
    3:    (None, "there it is / here you go", "'Voilà' points something out; 'ici' is the adverb 'here'."),
    20:   (None, "to look forward to / can't wait", "Fuller gloss for the avoir hâte (de) construction."),
    23:   ("la boîte", None, "boîte is feminine."),
    28:   (None, "on (preposition) — note sûr = sure", "Distinguishes sur from its homophone sûr."),
    52:   ("l'entreprise", None, "Elides before a vowel: l'entreprise (f)."),
    57:   ("le remerciement", None, "remerciement is masculine."),
    61:   ("le fusil", None, "fusil is masculine."),
    66:   ("la croix", None, "croix is feminine."),
    74:   ("les cheveux", None, "Hair is plural in French; le cheveu is a single strand."),
    95:   (None, "this / that (masculine, before a vowel or mute h)", "Clarifies when cet is used instead of ce."),
    114:  ("dès", "from / as of", "'Dès' means from (a time onward). 'Des' is the plural indefinite article 'some'."),
    121:  (None, "an angel", "un ange = angel; 'angle' is un angle."),
    123:  ("le champignon", None, "champignon is masculine."),
    177:  ("la guitare", None, "guitare is feminine."),
    184:  ("le travail", None, "travail is masculine."),
    208:  (None, "this one (feminine)", "celle is the feminine demonstrative pronoun."),
    212:  ("la seconde", None, "La seconde = the second (time unit); le second = the second one."),
    252:  (None, "the contribution / input", "apport is masculine; 'contribution' is the usual sense."),
    282:  (None, "all / every", "Clearer gloss for tout."),
    290:  ("la part", None, "la part = a share/portion. (le part exists but means an animal's birthing.)"),
    305:  ("évidemment", None, "Missing accent."),
    307:  ("le fils", "son", "fils = son. 'Child' is l'enfant."),
    327:  ("l'été", None, "Missing accent."),
    351:  ("le coucher de soleil", None, "coucher is masculine here (the noun, not the verb)."),
    409:  ("parce que", None, "'Parce' does not stand alone; the conjunction is parce que."),
    471:  (None, "the study", "l'étude = study/survey. 'Research' is la recherche."),
    483:  ("la jambe", None, "jambe is feminine."),
    504:  (None, "really / truly", "vraiment = really. 'Actually' is en fait."),
    539:  ("précédent/e/s", None, "Missing accent."),
    557:  ("anglais", "English", "Typo: anglias."),
    559:  (None, "salad", "Typo: salat."),
    561:  ("les frites", None, "Plural and feminine: les frites."),
    625:  (None, "currently", "False friend: actuellement means currently, never 'actually'."),
    706:  ("le passé", None, "le passé (noun). 'passée' is the feminine past participle."),
    724:  ("c'est parti", None, "No cedilla-apostrophe: c'est parti."),
    744:  (None, "pleasant", "Typo: plesant."),
    758:  (None, "the plate (the dish you eat off)", "Clarifies the gloss."),
    765:  ("la pomme de terre", None, "pomme is feminine, so la pomme de terre."),
    805:  ("dangereux/se", None, "Adds the feminine form."),
    811:  (None, "because of / due to", "à cause de gives a cause, usually a negative one; 'as a result' is par conséquent."),
    833:  (None, "except / unless", "Typo: expect."),
    891:  ("lourd/e", None, "Citation form is the masculine lourd."),
    927:  ("attirer", None, "Infinitive, not the third-person 'attire'."),
    944:  ("sûrement", None, "Missing circumflex."),
    611:  ("gentil/le/s", None,
           "The feminine doubles the l: gentille. Written gentil/e it reads as 'gentile'."),
    907:  ("cruel/le/s", None,
           "One masculine, one feminine, one plural marker. The source listed the plural twice."),
    1043: ("le colocataire / le coloc", None,
           "Written coloc/ataire the slash falls mid-word; these are the full word and its clipping."),
    1173: ("violet/te/tes", None,
           "The feminine doubles the t: violette."),
    967:  (None, "dough / batter / pasta dough",
           "La pâte is the raw dough, not the finished pastry — that is la pâtisserie, already at 966."),
    995:  (None, "to be born", "naître = to be born."),
    1005: ("la Grèce", None, "Country names are capitalised."),
    1017: (None, "the top (garment)", "Clearer gloss."),
    1053: ("à la fin", None, "Wrong accent: á."),
    1060: (None, "through / across", "à travers = through. 'Towards' is vers."),
    1090: (None, "to jam / to get stuck", "Grammatical English gloss."),
    1097: ("ce n'est pas la peine", "it's not worth it", "The set phrase needs 'la'."),
    1122: ("la sculpture", None, "sculpture is feminine."),
    1143: ("se manquer", None, "Infinitive form."),
    1194: ("la roche", None, "roche is feminine."),
    1201: ("la feuille", None, "feuille is feminine."),
    1202: ("la grenouille", None, "grenouille is feminine."),
    1211: ("bof", None, "Usual spelling."),
    1213: ("le chiant", None, "Spelling; vulgar slang for an annoying thing or person."),
    1215: ("beau gosse (bg)", None, "Headword is the full phrase."),
    1220: (None, "to pull / to score, to buy drugs (slang)", "Typo: drags."),
    1252: ("la scène", None, "Wrong accent: scéne."),
    1259: ("mineur/e", None, "Citation form is the masculine mineur."),
    1282: ("la sorte", None, "sorte is feminine."),
    1283: (None, "identical", "English gloss was left in French."),
    1321: ("la campagne", "the countryside", "compagne = a female companion; campagne = countryside."),
    1322: ("désirer", None, "Infinitive to match the 'to desire' gloss; the noun is le désir."),
    1324: ("le loisir", None, "Adds the article."),
    1327: ("la logique", None, "logique is feminine."),
    1348: ("sans domicile fixe (SDF)", None, "Singular citation form."),
    1350: ("se presser", None, "Infinitive form."),
    1364: ("la noix", None, "noix is feminine."),
    1380: ("l'électricité", None, "Uncountable: l'électricité (f)."),
    1385: ("ne pas prendre pour acquis", None, "Infinitive form."),
    1427: ("le maillot", None, "Typo: il."),
    1439: ("le rendez-vous", None, "Typo: il."),
    1441: ("la coupe de cheveux", None, "No article inside the compound."),
    1445: ("la disponibilité", None, "Adds the article."),
    1455: ("une foison", None, "foison is feminine."),
    1460: ("la survie", None, "survie is feminine."),
    1489: (None, "to go on and on about something (not standard French)", "Kept as recorded, but 'mettre un tunnel' is not idiomatic; standard is creuser."),
    1496: ("couper court (à)", None, "Infinitive form."),
    1497: (None, "to shatter", "Typo: shutter."),
    1506: ("la brûlure", "a burn (noun)", "brûlure is the noun; the verb is brûler (already at 1422)."),
    1518: (None, "stingy", "Removed the Hebrew gloss."),
}

# ---------------------------------------------------------------- themes
# Comma-separated headwords. A word may sit in several themes.
THEMES = {
    "food": """pain pita, le pain, la tomate, la salade, le concombre, les frites, le fromage,
        la soupe, le repas, la boisson, la viande, le boeuf, le saumon, la pomme de terre, l'huile,
        le beurre, le sel, le poivre, l'épice, le légume, le fruit, la fraise, la cerise, le raisin,
        la confiture, la pomme, la carotte, le poulet, le sucre, le miel, le blé, la noix, un épinard,
        la courgette, le jus, l'alcool, le vin, la bière, le café, le thé, la tasse, le verre,
        l'assiette, la fourchette, la cuillère, le couteau, la poêle, le four, la recette, cuisiner,
        la cuisine, cuire, la cuisson, goûter, manger, bouffer, déjeuner, le petit déjeuner, le plat,
        les pâtes, le riz, maïs, le gâteau, la pâtisserie, la pâte, les viennoiseries, la tartine,
        amer, aigre, épicé, salé, sucré, saignant, à point, la glace, le lait, l'oeuf, la nourriture,
        l'alimentation, le citron, la bouteille, griller, pimenter, la champignon, l'oignon,
        le poisson, la sauce, le panier, servir, commander, l'addition, le serveur, être + faim,
        la soif, la faim, délicieux/délicieuse, la crème solaire""",

    "body": """le corps, la tête, le bras, le jambe, la main, le pied, l'oreille, le nez, la bouche,
        œil, les yeux, le cheveux, le cou, l'épaule, la poitrine, le ventre, le dos, la peau,
        le coeur, le visage, la face, les lèvres, la dent, l'ongle, le pouce, la nuque, le sein,
        le doigt, la gueule, le cul, la barbe, la graisse, musclé/e, la taille, l'os, le sang,
        la voix, l'esprit, un esprit, respirer, la chaleur""",

    "health": """malade, la maladie, la médecine, l'hôpital, le médecin, la douleur, la blessure,
        la santé, le mal de tête, la piqûre, brûlure, vomir, s'entraîner, la natation, le toubib,
        la pilule, enceinte, souffrir, la sieste, se relaxer, se détendre, aller + mieux, fragile,
        la dépendance, l'estime de soi""",

    "family": """le frère, la soeur, le père, la mère, le parent, l'enfant, le bébé, la femme,
        l'homme, le mari, l'épouse, l'oncle, la tante, Le fils, la copine, le copain, le pote,
        le couple, la mariée, marier, les noces, le célibataire, en couple, l'enfance,
        l'anniversaire, le voisin / la voisine, le coloc/ataire""",

    "home": """la maison, La chambre, la salle de bain, la cuisine, La table, La chaise, le lit,
        le canapé, la porte, La fenêtre, Le toit, le mur, le sol, l'étage, la poubelle, l'évier,
        l'étagère, une armoire, un placard, le meuble, le volet, le sous-sol, la cour, le jardin,
        l'immeuble, la lampe, Le miroir, la serviette, la couverture, l'oreiller, le tableau,
        le vase, la cloche, le climatiseur / la clim, la lessive, Le savon, La bougie,
        le papier toilette, les toilettes, l'ordinateur, le fichier, le chargeur, une échelle,
        le bouchon, le drap, la colle, nettoyer, la poignée, l'électricité, le fer""",

    "clothes": """le vêtement, une chemise, le pantalon, la jupe, le short, le jean, la chaussure,
        la chaussette, la robe, le manteau, le chapeau, le gant, une écharpe, il maillot, la manche,
        le haut, assorti/e, les lunettes, les lunettes de soleil, le sac, Le portefeuille, le bijou,
        porter, s'habiller, La coiffure, la coupe des cheveux, raser, le parapluie, le cuir,
        La valise, le masque""",

    "travel": """voyager, le train, La gare, L'avion, l'aéroport, le vol, Le bateau, la barque,
        la voiture, le vélo, la moto, la bicyclette, le camion, le billet, la carte, les vacances,
        réserver, Le plan, aller simple, aller-retour, l'embouteillage, les transports en commun,
        le conducteur, le trottoir, la randonnée, la tente, le désert, la plage, la mer, l'océan,
        la montagne, le lac, la forêt, le paysage, la côte, la région, le territoire, la frontière,
        visiter, explorer, la bagnole, le parasol, le sable, se baigner, se noyer, louer, la carte,
        Allemagne, Italie, République tchèque, la grèce, le métèque, escalader, Le pont, le port""",

    "city": """la ville, le quartier, La rue, le marché, le supermarché, le magasin, la banque,
        La pharmacie, La librairie, la bibliothèque, le musée, l'église, le restaurant, le café,
        Le parc, La piscine, Le cirque, le théâtre, l'exposition, le spectacle, le lycée, l'école,
        l'arrondissement, le coin, l'endroit, le lieu, le panneau, L'ascenseur, l'escalier,
        le bureau, la place, nord, sud, est, Ouest, l'attraction, l'adresse""",

    "work": """la travail, travailler, le boulot, métier, le patron, l'employé, le collègue,
        l'entretien, embaucher, le chômage, la société, La entreprise, le projet, la réunion,
        le congé, l'ouvrier, directeur/directrice, programmeur, développer, le/la bénévole,
        négocier, la facture, un impôt, le sondage, le critère, l'usager, l'usage, le cadre,
        le format, le produit, le niveau, la capacité, bosser, le moniteur, l'équipage,
        le transporteur, réussir, l'argent, l'achat, dépenser, coûter, Le prix, la monnaie,
        le reçu, l'étape, fabriquer, produire, organiser, planifier, prévoir""",

    "school": """l'élève, l'enseignant, le maître, la leçon, le vocabulaire, la langue, le langage,
        langue maternelle, étudier, apprendre, un examen, les devoirs, un cahier, le crayon,
        Le stylo, le papier, un livre, le chapitre, le résumé, la note, le texte, le titre,
        la traduction, traduire, épeler, prononcer, la phrase, Le verbe, masculin, féminin,
        la règle, la question, la réponse, expliquer, la classe, Hébreu, italienne, anglias,
        le francophone, corriger, vérifier, pratiquer, l'étude, la recherche""",

    "nature": """L'arbre, la fleur, l'herbe, le bois, la roche, La terre, l'eau, le feu, le vent,
        la pluie, la neige, le soleil, Le ciel, l'étoile, le nuage, l'éclair, l'ombre, la vague,
        la goutte, la poussière, la flamme, la saison, Le printemps, L'hiver, l'automne, la météo,
        La lumière, le feuille, la paille, le trou, Le fond, le coucher de soleil, le lever du soleil,
        froide, chaud/e, froid/e, la glace, l'or, le blé""",

    "animals": """le chien, le chat, le cheval, le mouton, Le poisson, l'oiseau, le lapin,
        le requin, l'ours, la souris, l'abeille, l'écureuil, le grenouille, le chameau, le loup,
        le boeuf, le poulet, la fée""",

    "time": """Le jour, La semaine, le mois, L'année, un an, Heure, l'heure, la minute, le matin,
        le soir, l'après-midi, le midi, la nuit, aujourd'hui, Demain, Hier, hier soir, le lendemain,
        maintenant, Tôt, Tard, bientôt, Déjà, toujours, Jamais, souvent, parfois, quotidienne,
        le dimanche, le lundi, le mardi, le mercredi, le jeudi, le vendredi, le samedi, Janvier,
        Février, Mars, Avril, Mai, Juin, Juillet, Août, Septembre, Octobre, Novembre, Décembre,
        le calendrier, la durée, le passée, le futur, le moment, l'instant, Longtemps, récemment,
        désormais, entre-temps, fin de semaine, la montre, tous les jours, combien de temps,
        pendant, lors, depuis que, l'âge, la fois, fois, à l'avance, tout de suite, la vitesse""",

    "numbers": """Deux, Cinq, Six, Sept, huit, Dix, Onze, Treize, Quinze, trente, cent, mille,
        le nombre, le demi, le tiers, le quart, Premier, le deuxième, le troisième, le quatrième,
        Compter, diviser, combien, plusieurs, la majorité, la plupart, plupart, environ,
        Beaucoup, Trop, un peu, assez, la taille""",

    "colours": """Blanc, Noir/e/s, rouge, bleu, Vert/e/s, jaune, gris/e/s, rose/s, marron/s,
        violet/e/es, Brun, brun/ne, blond/e, roux/sse, la couleur, Clair, foncé, sombre, clair/e/s""",

    "feelings": """heureux, Joyeux, content, la peur, La joie, l'envie, le souci, fâché/e/s, ravi/e,
        curieux/se, jaloux/se, nerveux/se, timide, paresseux/se, courageux/se, fier/e, Sérieux/se,
        sage, arrogant/e, l'humeur, l'humour, la confiance, la larme, pleurer, rire, rigoler,
        s'ennuyer, s'amuser, détester, aimer, espérer, regretter, douter, craindre, inquiéter,
        La menace, marrant/e, Drôle, la blague, plaisanter, énerver, se réjouir, avoir de la peine,
        Se marrer, s'éclater, kiffer, chouette, sympa, génial/e, formidable, ennuyeux/se""",

    "people": """la personne, les gens, l'ami, le voisin / la voisine, un invité, le groupe,
        la foule, l'équipe, Le juif, le chrétien, le musulman, l'étranger, étranger/e, le soldat,
        le sauveur, le tricheur, menteur/use, le gosse, mec, meuf, Monsieur, Le garçon, la fille,
        jeune, âgé/e, L'acteur / L'actrice, Le chanteur / La chanteuse, le personnage,
        serveur/se, le caissier, Le judaïsme, les sans domicile fixes | SDF, le célibataire""",

    "connectors": """et, Ou, Mais, donc, car, Parce, alors, ensuite, enfin, finalement, d'abord,
        puis, cependant, pourtant, malgré, bien que, même si, au cas où, c'est pourquoi,
        C'est-à-dire, Autrement dit, par exemple, tel que, En fait, Justement, du coup, Du coup,
        afin que, Afin que, Grâce à, À cause de, par conséquent, en tant que, ainsi que, d'ailleurs,
        quand même, de toute façon, bref, pour faire court, a part ça, au lieu de, soit … soit,
        ne … ni … ni, non plus, plutôt, outre, selon, d'après, lorsque, Pendant que, avant que,
        depuis que, comme, sauf, Probablement, peut-être, plus que, moins que, autant que,
        jusqu'à, Devant, à travers, parmi, pour, sans, avec, Dans, par, contre, vers, entre,
        derrière, autour, Après, avant""",

    "grammar": """Ils sont, Elles sont, que, qui, quoi, où, quand, comment, Pourquoi, combien,
        quel, lequel/lesquels/laquelle/lesquelles, Cet, Ces, Celle, y, on, ma, le mien / la mienne,
        le tien / la tienne, le sien / la sienne, tous, Tout, chaque, chacun/e, quelque,
        quelque chose, quiconque, Aucun/e, aucun, rien, plus, moins, si, Ne...que, ne … plus,
        il y a, il y avait, il faut, il faudra, est-ce que…, soi-même, Autre, Dès, Voilà,
        tout le monde, tout seul, seul/e, certain/e/s, Même, ici, là, là bas, s'agit il""",

    "slang": """bordel, bazar, boff, bouffer, le chaint, au calme / oklm, bg (beau gosse), chanmé,
        chelou, cimer, ouf, pécho, relou, téma, avoir le seum, laisser tomber, se casser, mec,
        meuf, bosser, la clope, truc, coucou, la bagnole, le pote, kiffer, la gueule, le cul,
        péter, choper, le gosse, tarpin, s'éclater, Se marrer, le boulot, radin/e, nul/le""",

    "phrases": """s'il vous plaît, s'il te plaît, Bonne chance, Enchanté/Enchantée, Je suis désolé,
        bien sûr, d'accord, Tout à coup, tout de suite, ça me va, ça sonne bien, ça veut dire,
        ça y est, c'est ça, c'est tout, ç'est parti, Allons-y, vas-y, à tout à l'heure, à plus tard,
        A tes/vos souhaits, tant pis, pas trop, petit à petit, par hasard, à l'avance, à peine,
        à jamais, à l'envers, d'un coup, Encore une fois, pour le moment, au départ, Au début,
        á la fin, de trop, 24 heures sur 24, Comment dit-on ___ en français ?, quand même assez,
        sur le pouce, dans mon dos, Avoir hâte, Avoir beau + (infinitive-verb), faire attention,
        prendre soin, se rendre compte, avoir l'impression, avoir + l'air, changer d'avis,
        ce n'est pas peine, ne pas pris pour acquis, en ligne, au même endroit, près d'ici,
        à proximité, tous les deux, on est le <jour> <nombre> <mois>, __ fois par __""",
}


def strip_accents(s):
    return "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")


def dkey(s):
    """Dedupe key: accents preserved, because ou/où and sur/sûr are different words."""
    s = s.lower().replace("\u2019", "'")
    s = re.sub(r"[^0-9a-z\u00c0-\u024f' ]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def norm(s):
    s = strip_accents(s.lower())
    s = re.sub(r"[^a-z0-9' ]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


THEME_INDEX = {}
for theme, block in THEMES.items():
    for headword in block.split(","):
        hw = " ".join(headword.split())
        if not hw:
            continue
        THEME_INDEX.setdefault(norm(hw), set()).add(theme)
        # also index without a leading article, so "le corps" matches "corps"
        bare = re.sub(r"^(le|la|les|un|une|l')\s*", "", hw.lower()).strip()
        if bare and bare != hw.lower():
            THEME_INDEX.setdefault(norm(bare), set()).add(theme)


# Gender of nouns that elide to l' (and a few the article doesn't reveal).
ELIDED_GENDER = {
    "élève": "mf", "âme": "f", "île": "f", "entreprise": "f", "outil": "m", "arbre": "m",
    "avis": "m", "état": "m", "enfant": "mf", "ami": "m", "école": "f", "écran": "m",
    "escalier": "m", "homme": "m", "eau": "f", "ail": "m", "accueil": "m", "orgueil": "m",
    "accent": "m", "année": "f", "avion": "m", "apport": "m", "ascenseur": "m",
    "attention": "f", "exemple": "m", "oignon": "m", "automne": "m", "os": "m", "oeuf": "m",
    "hiver": "m", "été": "m", "oiseau": "m", "enseignant": "m", "éclair": "m",
    "acteur / l'actrice": "mf", "histoire": "f", "étude": "f", "anniversaire": "m",
    "étoile": "f", "équipe": "f", "épouse": "f", "heure": "f", "âge": "m", "oreille": "f",
    "endroit": "m", "exposition": "f", "ombre": "f", "après-midi": "m", "envie": "f",
    "assiette": "f", "épice": "f", "huile": "f", "alcool": "m", "argent": "m", "étape": "f",
    "hôpital": "m", "aéroport": "m", "adresse": "f", "instant": "m", "addition": "f",
    "embouteillage": "m", "étage": "m", "intérêt": "m", "option": "f", "ours": "m",
    "église": "f", "étagère": "f", "attraction": "f", "or": "m", "ordinateur": "m",
    "expérience": "f", "objet": "m", "évier": "m", "humour": "m", "humeur": "f",
    "entretien": "m", "approche": "f", "employé": "m", "événement": "m", "océan": "m",
    "immeuble": "m", "oncle": "m", "usager": "m", "usage": "m", "épaule": "f", "ongle": "m",
    "épée": "f", "abeille": "f", "écureuil": "m", "opposé": "m", "arrondissement": "m",
    "herbe": "f", "oreiller": "m", "alimentation": "f", "achat": "m", "ouvrier": "m",
    "ambiance": "f", "estime de soi": "f", "électricité": "f", "enfance": "f", "enfer": "m",
}

# Words that keep their capital letter (months and weekdays are lowercase in French).
PROPER = {
    "noël", "monsieur", "hébreu", "allemagne", "italie", "république tchèque", "la grèce",
    "sdf", "sans domicile fixe (sdf)",
}

ARTICLES = {
    "le": ("m", "le "), "la": ("f", "la "), "les": ("pl", "les "),
    "un": ("m", "un "), "une": ("f", "une "),
}

VERB_END = re.compile(r"(er|ir|re|oir|re|ître|aître|indre|oudre)$")


def classify(fr, en):
    """Return (pos, gender, headword-without-article)."""
    low = fr.lower()
    gender, base = "", fr

    m = re.match(r"^(l['’])\s*(.+)$", low)
    if m:
        base = fr[len(m.group(1)):].strip()
        gender = ELIDED_GENDER.get(base.lower(), "mf")
    else:
        first = low.split(" ")[0]
        if first in ARTICLES and " " in low:
            gender = ARTICLES[first][0]
            base = fr.split(" ", 1)[1]

    if en.lower().startswith("to "):
        return "verb", gender, base
    if gender:
        return "noun", gender, base
    if re.search(r"\(adj\)", en) or re.search(r"/(e|se|le|ne|ve|che|sse|ce|te)(/s|/es)?$", low):
        return "adj", "", base
    if norm(fr) in THEME_INDEX and "connectors" in THEME_INDEX[norm(fr)]:
        return "connector", "", base
    if norm(fr) in THEME_INDEX and "grammar" in THEME_INDEX[norm(fr)]:
        return "grammar", "", base
    if " " in fr.strip():
        return "phrase", "", base
    if VERB_END.search(low) and not en.lower().startswith(("the ", "a ", "an ")):
        return "verb", "", base
    return "other", "", base


def main():
    raw = io.open(SRC, encoding="utf-8").read().split("\n")
    entries, applied = [], []

    for line in raw:
        line = line.strip()
        m = re.match(r"^(\d+)\.\s+(.*)$", line)
        if not m:
            continue
        idx, rest = int(m.group(1)), m.group(2)

        # Split on the first " - " that separates French from English.
        parts = re.split(r"\s+-\s+", rest, maxsplit=1)
        if len(parts) != 2:
            parts = [rest, ""]
        fr, en = parts[0].strip(), parts[1].strip()
        orig_fr, orig_en = fr, en

        if idx in CORRECTIONS:
            new_fr, new_en, reason = CORRECTIONS[idx]
            if new_fr:
                fr = new_fr
            if new_en:
                en = new_en
            applied.append((idx, orig_fr, orig_en, fr, en, reason))

        # The source list capitalises inconsistently; lowercase everything that
        # isn't a proper noun so the entries read as dictionary headwords.
        if fr[:1].isupper() and fr.lower() not in PROPER and not re.match(r"^[A-Z]{2,}", fr):
            fr = fr[0].lower() + fr[1:]

        pos, gender, base = classify(fr, en)
        themes = sorted(THEME_INDEX.get(norm(fr), set()) | THEME_INDEX.get(norm(base), set()))
        if not themes:
            themes = ["general"]

        entries.append({
            "n": idx, "fr": fr, "en": en,
            "pos": pos, "g": gender, "base": base,
            "themes": themes, "key": dkey(fr),
        })

    # ------------------------------------------------------------ dedupe
    seen, merged, dupes = {}, [], []
    for e in entries:
        k = e["key"]
        if k in seen:
            first = seen[k]
            dupes.append((e["n"], e["fr"], e["en"], first["n"], first["en"]))
            # Keep an alternative gloss when it genuinely adds meaning.
            extra = re.sub(r"\s*\(\d\)\s*$", "", e["en"]).strip()
            if extra and norm(extra) != norm(first["en"]) and extra.lower() not in first["en"].lower():
                first["en"] = first["en"] + "; " + extra
            first.setdefault("also", []).append(e["n"])
            continue
        seen[k] = e
        merged.append(e)

    for i, e in enumerate(merged):
        e["id"] = "w" + str(e["n"])
        e.pop("key", None)

    theme_counts = {}
    for e in merged:
        for t in e["themes"]:
            theme_counts[t] = theme_counts.get(t, 0) + 1

    payload = {
        "count": len(merged),
        "source_count": len(entries),
        "themes": dict(sorted(theme_counts.items(), key=lambda kv: -kv[1])),
        "words": merged,
    }
    io.open(OUT, "w", encoding="utf-8").write(json.dumps(payload, ensure_ascii=False, indent=1))

    # ------------------------------------------------------------ corrections doc
    md = ["# Corrections to the source material", "",
          "This course was built from a hand-written study document. Everything below is a",
          "change made to that material while converting it. Nothing here is hidden: if you",
          "disagree with a call, edit `data/vocab-source.txt` or the `CORRECTIONS` table in",
          "`tools/build-vocab.py` and re-run `python3 tools/build-vocab.py`.", "",
          "## Vocabulary: corrected entries", "",
          "| # | Was | Now | Why |", "|---|---|---|---|"]
    for idx, ofr, oen, nfr, nen, reason in applied:
        was = ofr + " — " + oen
        now = nfr + " — " + nen
        md.append("| %d | %s | %s | %s |" % (idx, was, now, reason))

    md += ["", "## Vocabulary: duplicates merged", "",
           "These entries repeat a word already in the list. The first occurrence is kept and",
           "any extra meaning is folded into its gloss.", "",
           "| # | Entry | Merged into # |", "|---|---|---|"]
    for n, fr, en, first_n, first_en in dupes:
        md.append("| %d | %s — %s | %d |" % (n, fr, en, first_n))

    md += ["", "**Totals:** %d source entries, %d corrections, %d duplicates merged, %d unique words."
           % (len(entries), len(applied), len(dupes), len(merged)), ""]

    io.open(CORR, "w", encoding="utf-8").write("\n".join(md))

    print("source entries : %d" % len(entries))
    print("corrections    : %d" % len(applied))
    print("duplicates     : %d" % len(dupes))
    print("unique words   : %d" % len(merged))
    print("themes         : %s" % ", ".join("%s=%d" % kv for kv in payload["themes"].items()))


if __name__ == "__main__":
    main()
