#!/usr/bin/env node
import { apiGet, apiPost, apiDelete, encId, runTest } from './test-utils.mjs';

const DIR = import.meta.dirname;

await runTest('class', DIR, async (ctx) => {
  let s = ctx.step('Create class diagram');
  let diagramId;
  try {
    const res = await apiPost('/api/class/diagrams', { name: 'Test Class', type: 'UMLClassDiagram' });
    diagramId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create class (Person)');
  let personId;
  try {
    const res = await apiPost('/api/class/classes', { diagramId, name: 'Person', x1: 50, y1: 50, x2: 220, y2: 150 });
    personId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Add attribute to Person');
  try {
    await apiPost(`/api/class/classes/${encId(personId)}/attributes`, { name: 'name', type: 'String', visibility: 'private' });
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Add operation to Person');
  try {
    await apiPost(`/api/class/classes/${encId(personId)}/operations`, { name: 'getName', visibility: 'public' });
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create interface (Serializable)');
  let ifaceId;
  try {
    const res = await apiPost('/api/class/interfaces', { diagramId, name: 'Serializable', x1: 350, y1: 50, x2: 520, y2: 130 });
    ifaceId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create class (Student)');
  let studentId;
  try {
    const res = await apiPost('/api/class/classes', { diagramId, name: 'Student', x1: 50, y1: 250, x2: 220, y2: 330 });
    studentId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Add attribute to Student');
  try {
    await apiPost(`/api/class/classes/${encId(studentId)}/attributes`, { name: 'studentId', type: 'int', visibility: 'private' });
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create generalization: Student → Person');
  try {
    await apiPost('/api/class/generalizations', { diagramId, sourceId: studentId, targetId: personId });
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create interface realization: Person → Serializable');
  try {
    await apiPost('/api/class/interface-realizations', { diagramId, sourceId: personId, targetId: ifaceId });
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create association: Person ↔ Student');
  try {
    await apiPost('/api/class/associations', { diagramId, sourceId: personId, targetId: studentId, name: 'mentors' });
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  await ctx.layoutDiagram(diagramId);
  await ctx.exportDiagram(diagramId, 'Export class image');

  s = ctx.step('Delete diagram');
  try {
    await apiDelete(`/api/class/diagrams/${encId(diagramId)}`);
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }
});
