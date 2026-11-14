// Rescue kit for the meetup (given 2026-11-12, cold test 2026-11-14).
// Meaning -> French. Ids res-NN, append only.
window.BANK = {
  title: 'Rescue kit',
  key: 'drill-rescue',
  intro: 'Cold test. Read the English, type the French you would say to her (tu). Accents and apostrophes are ignored.',
  questions: [
    { id: 'res-1', say: 'Pardon ?', a: ['{Pardon|Hein|Comment|Quoi}', '{Pardon|Hein|Comment|Quoi}{,|} {pardon|hein|comment|quoi}'], en: 'Sorry? / Huh? (you did not hear)', why: 'Pardon ? neutral; Hein ? casual; Quoi ? blunt.', tags: ['rescue'] },
    { id: 'res-2', say: 'Tu peux répéter ?', a: ['{Tu peux|Est-ce que tu peux|Tu pourrais|Tu peux me|Tu peux le|Tu pourrais le} répéter{ s\'il te plaît| stp|}'], en: 'Can you say that again?', why: 'répéter, with tu.', tags: ['rescue'] },
    { id: 'res-3', say: 'Tu peux parler un peu plus lentement ?', a: ['{Tu peux|Est-ce que tu peux|Tu pourrais} parler {un peu |}{plus lentement|moins vite}{ s\'il te plaît| stp|}'], en: 'Can you speak a bit more slowly?', why: 'plus lentement = moins vite.', tags: ['rescue'] },
    { id: 'res-4', say: 'Ça veut dire quoi, flou ?', a: ['Ça veut dire quoi{,|} flou', 'Qu\'est-ce que ça veut dire{,|} flou', 'Qu\'est-ce que {ça veut dire|veut dire} flou', 'Que veut dire flou', 'Flou{,|} ça veut dire quoi'], en: 'What does "flou" mean?', why: 'Ça veut dire quoi, X ? spoken order: question first, word last.', tags: ['rescue'] },
    { id: 'res-5', say: 'C\'est-à-dire ?', a: ['{C\'est-à-dire|C\'est à dire|Ça veut dire quoi|Comment ça}'], en: 'Meaning? (you ask her to explain what she just said)', why: 'C\'est-à-dire ? = what do you mean by that?', tags: ['rescue'] },
    { id: 'res-6', say: 'J\'ai pas tout compris.', a: ['{J\'ai pas|Je n\'ai pas} tout compris'], en: 'I didn\'t get all of it.', why: 'tout between the auxiliary and the participle: j\'ai pas TOUT compris.', tags: ['rescue'] },
    { id: 'res-7', say: 'Comment dire...', a: ['{Comment dire|Comment je dirais|Comment je pourrais dire|Comment je peux dire ça|Comment expliquer}'], en: 'How can I put it...', why: 'Comment dire... buys time.', tags: ['rescue'] },
    { id: 'res-8', say: 'Attends, je cherche le mot.', a: ['Attends{,|} je cherche {le|mon} mot'], en: 'Wait, I\'m looking for the word.', why: 'chercher = to look for, no preposition.', tags: ['rescue'] },
    { id: 'res-9', say: 'Comment on dit gear en français ?', a: ['{Comment on dit|Comment dit-on|Comment est-ce qu\'on dit|On dit comment} gear en français', 'Gear{,|} {on dit comment|comment on dit} en français'], en: 'How do you say "gear" in French?', why: 'Comment on dit X en français ? spoken order.', tags: ['rescue'] },
    { id: 'res-10', say: 'Tu vois ce que je veux dire ?', a: ['{Tu vois|Est-ce que tu vois|Tu comprends} ce que je veux dire'], en: 'You see what I mean?', why: 'ce que je veux dire = what I mean (vouloir dire).', tags: ['rescue'] },
    { id: 'res-11', say: 'Ah bon ?', a: ['{Ah bon|Vraiment|Ah oui|C\'est vrai}'], en: 'Really? (surprised, keeps her talking)', why: 'Ah bon ? the everyday "really?".', tags: ['rescue', 'react'] },
    { id: 'res-12', say: 'Sérieux ?', a: ['{Sérieux|Sérieusement|T\'es sérieuse|Tu es sérieuse|Vraiment|Non{,|} sérieux}'], en: 'Seriously? (casual)', why: 'Sérieux ? casual; sérieusement ? neutral.', tags: ['rescue', 'react'] },
    { id: 'res-13', say: 'Grave !', a: ['{Grave|Carrément|Trop|Clairement}'], en: 'Totally! (slang, one word)', why: 'Grave ! = totally (young, spoken). Carrément also works.', tags: ['rescue', 'react'] },
    { id: 'res-14', say: 'Trop bien !', a: ['{Trop bien|Trop cool|Génial|Super}'], en: 'So cool!', why: 'trop = so/very in speech: trop bien, trop drôle.', tags: ['rescue', 'react'] },
    { id: 'res-15', say: 'Ça marche.', a: ['{Ça marche|D\'accord|OK|Ça roule|Ça me va|Pas de souci}'], en: 'Deal / OK (agreeing to a plan)', why: 'Ça marche = deal, sounds natural.', tags: ['rescue', 'react'] },
    { id: 'res-16', say: 'Ça te dit d\'aller boire un verre ?', a: ['{Ça te dit|Ça te dirait|Ça te tente|T\'as envie|Tu as envie} d\'aller boire {un verre|un coup|quelque chose|un café}', '{Tu veux|Tu voudrais|On va|On pourrait} aller boire {un verre|un coup|quelque chose|un café}', 'Tu veux qu\'on aille boire {un verre|un coup|quelque chose|un café}'], en: 'Do you fancy going for a drink?', why: 'Ça te dit de + inf ? = fancy...? Ça te dirait = softer.', tags: ['rescue', 'react'] },
    { id: 'res-17', say: 'Je ne sais pas.', a: ['{Je ne sais pas|Je sais pas}'], en: 'You hear "chais pas". Write the full form.', why: 'chais pas = je (ne) sais pas.', tags: ['rescue', 'hear'] },
    { id: 'res-18', say: 'Je suis', a: ['Je suis'], en: 'You hear "chuis". Write the full form.', why: 'chuis = je suis.', tags: ['rescue', 'hear'] },
    { id: 'res-19', say: 'Il y a', a: ['Il y a'], en: 'You hear "y\'a". Write the full form.', why: 'y\'a = il y a. A lone "a" before a noun is often il y a.', tags: ['rescue', 'hear'] },
    { id: 'res-20', say: 'Tu as', a: ['Tu as'], en: 'You hear "t\'as". Write the full form.', why: 't\'as = tu as; t\'es = tu es.', tags: ['rescue', 'hear'] }
  ]
};
