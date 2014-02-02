var args = process.argv;

args.push('--paths')
args.push(__dirname + '/../example');

var racun = require('../../racun');

module.exports = {	
	packageAI: function(test) {
		test.equal(racun.getPackage('AI').name, 'AI', 'Package AI is not detected');
		test.done();
	},
	
	classAI: function(test) {
		test.equal(racun.getClassFromPackage('AI', 'AI').name, 'AI', 'Class AI is not detected');
		test.done();
	},
	
	classAIMethods: function(test) {		
		var onTargetChanges = racun.getMethodFromClass('AI', 'AI', 'onTargetChanges');
		test.equal(onTargetChanges['description'], 'Funcion que se ejecuta cuando el objeto cambia');
		test.equal(onTargetChanges['visibility'], 'public');
		test.equal(onTargetChanges['static'], false);
		test.equal(onTargetChanges['abstract'], true);
		
		var getBoss = racun.getMethodFromClass('AI', 'AI', 'getBoss');
		test.equal(getBoss['description'], 'Obter unidad que hace de boss');
		test.equal(getBoss['visibility'], 'public');
		test.equal(getBoss['static'], false);
		test.equal(getBoss['abstract'], false);
		
		var setTarget = racun.getMethodFromClass('AI', 'AI', 'setTarget');
		test.equal(setTarget['description'], 'Asignamos el objetivo del boss');
		test.equal(setTarget['visibility'], 'public');
		test.equal(setTarget['static'], false);
		test.equal(setTarget['abstract'], false);

		var getTarget = racun.getMethodFromClass('AI', 'AI', 'getTarget');
		test.equal(getTarget['description'], 'Obtener objetivo del boss');
		test.equal(getTarget['visibility'], 'public');
		test.equal(getTarget['static'], false);
		test.equal(getTarget['abstract'], false);
		
		var attackTarget = racun.getMethodFromClass('AI', 'AI', 'attackTarget');
		test.equal(attackTarget['description'], 'Atacar objetivo');
		test.equal(attackTarget['visibility'], 'public');
		test.equal(attackTarget['static'], false);
		test.equal(attackTarget['abstract'], false);
		
		
		var setTargetToWeaker = racun.getMethodFromClass('AI', 'AI', 'setTargetToWeaker');
		test.equal(setTargetToWeaker['description'], 'Asignamos el objetivo del boss a la unidad mas debil que encuentre');
		test.equal(setTargetToWeaker['visibility'], 'public');
		test.equal(setTargetToWeaker['static'], false);
		test.equal(setTargetToWeaker['abstract'], false);
		
		var countEnemiesArround = racun.getMethodFromClass('AI', 'AI', 'countEnemiesArround');
		test.equal(countEnemiesArround['description'], 'Contar enemigos cercanos a un punto');
		test.equal(countEnemiesArround['visibility'], 'public');
		test.equal(countEnemiesArround['static'], false);
		test.equal(countEnemiesArround['abstract'], false);
		
		var getLocationFromIndex = racun.getMethodFromClass('AI', 'AI', 'getLocationFromIndex');
		test.equal(getLocationFromIndex['description'], 'Obtenemos location mediante indice del linked list waypoints');
		test.equal(getLocationFromIndex['visibility'], 'public');
		test.equal(getLocationFromIndex['static'], false);
		test.equal(getLocationFromIndex['abstract'], false);
		
		var getConvenientLocation = racun.getMethodFromClass('AI', 'AI', 'getConvenientLocation');
		test.equal(getConvenientLocation['description'], 'Obtenemos waypoint conveniente (donde no hay enemigos).');
		test.equal(getConvenientLocation['tags']['@return'], 'int');
		test.equal(getConvenientLocation['visibility'], 'public');
		test.equal(getConvenientLocation['static'], false);
		test.equal(getConvenientLocation['abstract'], false);
		
		var getFarWaypointIndex = racun.getMethodFromClass('AI', 'AI', 'getFarWaypointIndex');
		test.equal(getFarWaypointIndex['description'], 'Obtenemos el indice del waypoint que este mas alejado de una locacion');
		test.equal(getFarWaypointIndex['visibility'], 'public');
		test.equal(getFarWaypointIndex['static'], false);
		test.equal(getFarWaypointIndex['abstract'], false);
		
		var createWaypoints = racun.getMethodFromClass('AI', 'AI', 'createWaypoints');
		test.equal(createWaypoints['description'], 'Crear waypoints');
		test.equal(createWaypoints['visibility'], 'public');
		test.equal(createWaypoints['static'], false);
		test.equal(createWaypoints['abstract'], false);
		
		test.done();
	},
	
	classAIProperties: function(test) {		
		var boss = racun.getPropertyFromClass('AI', 'AI', 'boss');
		test.equal(boss['description'], 'Unidad que hace de boss');
		test.equal(boss['visibility'], 'protected');
		test.equal(boss['static'], false);
		test.equal(boss['constant'], false);
		test.equal(boss['array'], false);
		test.equal(boss['default'], 'null');
		
		var target = racun.getPropertyFromClass('AI', 'AI', 'target');
		test.equal(target['description'], 'Objetivo del boss');
		test.equal(target['visibility'], 'protected');
		test.equal(target['static'], false);
		test.equal(target['constant'], false);
		test.equal(target['array'], false);
		test.equal(target['default'], '');
		
		test.done();
	}
};