var express = require('express');
var router = express.Router();
var db = require('../database/database');

router.get('/', async function(req, res, next) {
  try {
    const { Voiture } = await db();
    
    const Voitures = await Voiture.findAll();
    console.log("€€€€€€€€€€€€€");
    console.log(Voitures);
    
    res.render('voiture.twig', { title: 'My form', Voitures: Voitures });
  } catch (e) {
    console.log(e);
    
    res.status(500).send('Internal Server Error');
  }
});

router.post('/create',async function(req, res, next) {
  
  const { Voiture } = await db();
  const { matricule,marque,modele } = req.body;
  await Voiture.create({matricule,marque,modele });
  res.redirect('/formsvoiture');
});


router.get('/update/:id', async (req, res) => {
  try {
    const { Voiture } = await db();

   
    const { matricule,marque,modele } = req.body;
    const { id } = req.params;

    const VoitureToUpdate = await Voiture.findByPk(id);

    
    if (!VoitureToUpdate) {
      return res.status(404).json({ error: 'Voiture not found' });
    }
    res.render('voitureupdate.twig', { title: 'Update form', Voiture: VoitureToUpdate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/update/:id', async (req, res) => {
  try {
    const { Voiture } = await db();

    
    const { matricule,marque,modele  } = req.body;
    const { id } = req.params;

    
    const VoitureToUpdate = await Voiture.findByPk(id);

    
    if (!VoitureToUpdate) {
      return res.status(404).json({ error: 'Voiture not found' });
    }

    
    VoitureToUpdate.matricule = matricule;
    VoitureToUpdate.marque = marque;
    VoitureToUpdate.modele = modele;
    await VoitureToUpdate.save();

    
    res.redirect('/formsvoiture');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/delete/:id', async (req, res) => {
  try {
    const { Voiture } = await db();

    const { id } = req.params;

    
    const VoitureToDelete = await Voiture.findByPk(id);

    
    if (!VoitureToDelete) {
      return res.status(404).json({ error: 'Voiture not found' });
    }

    await VoitureToDelete.destroy();

   
    res.redirect('/formsvoiture');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/recherche', async (req, res) => {
  try {
    const { Voiture } = await db();
    
    const { matricule } = req.body;

    const VoitureToFind = await Voiture.findOne({ where: { matricule } });

    if (!VoitureToFind) {
      res.render('voiture.twig', { title: 'Search', RechVoiture: "notFound" });
    }
    else{
    res.render('voiture.twig', { title: 'Search', RechVoiture: VoitureToFind });
  }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
