const Employee = require('../models/Employee');
const logger = require('../config/logger');

const pick = (b) => ({
    first_name: b.first_name,
    last_name: b.last_name,
    email: b.email,
    position: b.position,
    salary: b.salary,
    date_of_joining: b.date_of_joining,
    department: b.department
});

// Finds the employee and checks the caller owns it. Sends 404/403 itself and returns null on failure.
async function getOwned(req, res, eid) {
    const emp = await Employee.findById(eid);
    if (!emp) {
        res.status(404).json({ message: 'Employee not found' });
        return null;
    }
    if (emp.user.toString() !== req.user.id) {
        logger.warn('Authorization failed: not owner', { userId: req.user.id, eid });
        res.status(403).json({ message: 'Forbidden: employee belongs to another user' });
        return null;
    }
    return emp;
}

exports.list = async (req, res, next) => {
    try {
        const employees = await Employee.find({ user: req.user.id });
        res.status(200).json(employees);
    } catch (e) {
        next(e);
    }
};

exports.create = async (req, res, next) => {
    try {
        const emp = await Employee.create({ ...pick(req.body), user: req.user.id });
        res.status(201).json(emp);
    } catch (e) {
        next(e);
    }
};

exports.getOne = async (req, res, next) => {
    try {
        const emp = await getOwned(req, res, req.params.eid);
        if (emp) res.status(200).json(emp);
    } catch (e) {
        next(e);
    }
};

exports.update = async (req, res, next) => {
    try {
        const emp = await getOwned(req, res, req.params.eid);
        if (!emp) return;
        Object.assign(emp, pick(req.body));
        await emp.save();
        res.status(200).json(emp);
    } catch (e) {
        next(e);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const emp = await getOwned(req, res, req.query.eid);
        if (!emp) return;
        await emp.deleteOne();
        res.status(204).send();
    } catch (e) {
        next(e);
    }
};