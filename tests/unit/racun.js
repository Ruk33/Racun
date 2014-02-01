var racun = require('../../src/racun');
var args = process.argv;

args.push('--paths')
args.push(__dirname + '/../example');

racun.init(args);

module.exports = {			
	packageAI: function(test) {
		var package = racun.getPackage('AI');
		
		test.notEqual(package, null, 'Package AI is not detected');
		
		test.done();
	},
	
	classAI: function(test) {
		var classes = racun.getClassesFromPackage('AI');
		var classAI = classes['AI'];
		
		test.notEqual(classAI, null, 'Class AI is not detected');		
		test.equal(classAI['name'], 'AI', 'Class name is not correct');
		
		test.done();
	},
			
	classAIMethods: function(test) {
		var classes = racun.getClassesFromPackage('AI');
		var classAI = classes['AI'];
		var methods = classAI['methods'];

		test.notEqual(methods['onTargetChanges'], null);
		test.equal(methods['onTargetChanges']['description'], 'Funcion que se ejecuta cuando el objeto cambia');
		test.equal(methods['onTargetChanges']['visibility'], 'public');
		test.equal(methods['onTargetChanges']['static'], false);
		test.equal(methods['onTargetChanges']['abstract'], true);
		
		test.notEqual(methods['getBoss'], null);
		test.equal(methods['getBoss']['description'], 'Obter unidad que hace de boss');
		test.equal(methods['getBoss']['visibility'], 'public');
		test.equal(methods['getBoss']['static'], false);
		test.equal(methods['getBoss']['abstract'], false);
		
		test.notEqual(methods['setTarget'], null);
		test.equal(methods['setTarget']['description'], 'Asignamos el objetivo del boss');
		test.equal(methods['setTarget']['visibility'], 'public');
		test.equal(methods['setTarget']['static'], false);
		test.equal(methods['setTarget']['abstract'], false);

		test.notEqual(methods['getTarget'], null);
		test.equal(methods['getTarget']['description'], 'Obtener objetivo del boss');
		test.equal(methods['getTarget']['visibility'], 'public');
		test.equal(methods['getTarget']['static'], false);
		test.equal(methods['getTarget']['abstract'], false);
		
		test.notEqual(methods['attackTarget'], null);
		test.equal(methods['attackTarget']['description'], 'Atacar objetivo');
		test.equal(methods['attackTarget']['visibility'], 'public');
		test.equal(methods['attackTarget']['static'], false);
		test.equal(methods['attackTarget']['abstract'], false);
		
		test.notEqual(methods['setTargetToWeaker'], null);
		test.equal(methods['setTargetToWeaker']['description'], 'Asignamos el objetivo del boss a la unidad mas debil que encuentre');
		test.equal(methods['setTargetToWeaker']['visibility'], 'public');
		test.equal(methods['setTargetToWeaker']['static'], false);
		test.equal(methods['setTargetToWeaker']['abstract'], false);
		
		test.notEqual(methods['countEnemiesArround'], null);
		test.equal(methods['countEnemiesArround']['description'], 'Contar enemigos cercanos a un punto');
		test.equal(methods['countEnemiesArround']['visibility'], 'public');
		test.equal(methods['countEnemiesArround']['static'], false);
		test.equal(methods['countEnemiesArround']['abstract'], false);
		
		test.notEqual(methods['getLocationFromIndex'], null);
		test.equal(methods['getLocationFromIndex']['description'], 'Obtenemos location mediante indice del linked list waypoints');
		test.equal(methods['getLocationFromIndex']['visibility'], 'public');
		test.equal(methods['getLocationFromIndex']['static'], false);
		test.equal(methods['getLocationFromIndex']['abstract'], false);
		
		test.notEqual(methods['getConvenientLocation'], null);
		test.equal(methods['getConvenientLocation']['description'], 'Obtenemos waypoint conveniente (donde no hay enemigos).');
		test.equal(methods['getConvenientLocation']['tags']['@return'], 'int');
		test.equal(methods['getConvenientLocation']['visibility'], 'public');
		test.equal(methods['getConvenientLocation']['static'], false);
		test.equal(methods['getConvenientLocation']['abstract'], false);
		
		test.notEqual(methods['getFarWaypointIndex'], null);
		test.equal(methods['getFarWaypointIndex']['description'], 'Obtenemos el indice del waypoint que este mas alejado de una locacion');
		test.equal(methods['getFarWaypointIndex']['visibility'], 'public');
		test.equal(methods['getFarWaypointIndex']['static'], false);
		test.equal(methods['getFarWaypointIndex']['abstract'], false);
		
		test.notEqual(methods['createWaypoints'], null);
		test.equal(methods['createWaypoints']['description'], 'Crear waypoints');
		test.equal(methods['createWaypoints']['visibility'], 'public');
		test.equal(methods['createWaypoints']['static'], false);
		test.equal(methods['createWaypoints']['abstract'], false);
		
		test.done();
	},
			
	classAIProperties: function(test) {
		var classes = racun.getClassesFromPackage('AI');
		var classAI = classes['AI'];
		var properties = classAI['properties'];

		test.notEqual(properties['boss'], null);
		test.equal(properties['boss']['description'], 'Unidad que hace de boss');
		test.equal(properties['boss']['visibility'], 'protected');
		test.equal(properties['boss']['static'], false);
		test.equal(properties['boss']['constant'], false);
		test.equal(properties['boss']['array'], false);
		test.equal(properties['boss']['default'], 'null');
		
		test.notEqual(properties['target'], null);
		test.equal(properties['target']['description'], 'Objetivo del boss');
		test.equal(properties['target']['visibility'], 'protected');
		test.equal(properties['target']['static'], false);
		test.equal(properties['target']['constant'], false);
		test.equal(properties['target']['array'], false);
		test.equal(properties['target']['default'], '');
		
		test.done();
	}
};