import prisma from '../config/prisma.js';

export const getAllPricingRules = async (req, res) => {
  try {
    const rules = await prisma.pricingRule.findMany();
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createPricingRule = async (req, res) => {
  const { description, startDate, endDate, priceMultiplier, fixedPrice, category } = req.body;
  try {
    const newRule = await prisma.pricingRule.create({
      data: {
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        priceMultiplier: priceMultiplier ? parseFloat(priceMultiplier) : 1.0,
        fixedPrice: fixedPrice ? parseFloat(fixedPrice) : null,
        category: category || null
      }
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        action: 'CREATE_PRICING_RULE',
        entity: 'PricingRule',
        entityId: newRule.id,
        userId: req.user.id,
        details: JSON.stringify(newRule)
      }
    });

    res.status(201).json(newRule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePricingRule = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.pricingRule.delete({
      where: { id: parseInt(id) }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
