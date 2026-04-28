// Ejecutar con:
// npx ts-node --project tsconfig.test.json src/app/lib/maps/__tests__/optimizeRoute.test.ts

import { mapsService } from '../maps.service';

async function testOptimizeRoute() {
  console.log('🧪 Testeando mapsService.optimizeRoute...\n');

  const origin = { lat: 43.2691, lng: -2.0 }; // Sede pakAG

  const stops = [
    { packageId: 1, lat: 43.3183, lng: -1.9812 }, // Kale Nagusia, Donostia
    { packageId: 2, lat: 43.3126, lng: -1.8988 }, // Errenteria
    { packageId: 3, lat: 43.3156, lng: -2.0012 }, // Miraconcha, Donostia
    { packageId: 4, lat: 43.2718, lng: -2.0245 }, // Usurbil
    { packageId: 5, lat: 43.2698, lng: -1.9759 }, // Hernani
  ];

  console.log('📍 Origin:', origin);
  console.log('📦 Stops enviados:', stops.length);
  stops.forEach((s, i) =>
    console.log(`   ${i + 1}. pkg-${s.packageId} → (${s.lat}, ${s.lng})`)
  );
  console.log('');

  const result = await mapsService.optimizeRoute(origin, stops);

  console.log('✅ Resultado de optimizeRoute:');
  console.log('   Total distancia (km):', result.totalDistanceKm);
  console.log('   Total duración (min):', result.totalDurationMin);
  console.log('   Stops ordenados:');
  result.orderedStops.forEach((s) => {
    console.log(
      `   ${s.order + 1}. pkg-${s.packageId} → estimado: ${s.estimatedArrival}`
    );
  });

  const errors: string[] = [];

  if (!Array.isArray(result.orderedStops))
    errors.push('❌ orderedStops no es array');
  if (result.orderedStops.length !== stops.length)
    errors.push(
      `❌ Se esperaban ${stops.length} stops, llegaron ${result.orderedStops.length}`
    );
  if (typeof result.totalDistanceKm !== 'number')
    errors.push('❌ totalDistanceKm no es number');
  if (typeof result.totalDurationMin !== 'number')
    errors.push('❌ totalDurationMin no es number');

  result.orderedStops.forEach((s, i) => {
    if (!s.packageId) errors.push(`❌ Stop ${i} sin packageId`);
    if (typeof s.order !== 'number') errors.push(`❌ Stop ${i} sin order`);
    if (!s.estimatedArrival) errors.push(`❌ Stop ${i} sin estimatedArrival`);
    if (typeof s.lat !== 'number' || typeof s.lng !== 'number')
      errors.push(`❌ Stop ${i} sin lat/lng`);
  });

  if (errors.length > 0) {
    console.log('\n💥 ERRORES ENCONTRADOS:');
    errors.forEach((e) => console.log('  ', e));
    process.exit(1);
  } else {
    console.log('\n🎉 Todo correcto. mapsService.optimizeRoute funciona bien.');
    console.log(
      '   (Recuerda que ahora mismo es un stub — devuelve orden sin optimizar)'
    );
    console.log(
      '   Cuando implementes la API real de Google Maps, ejecuta este test otra vez.'
    );
  }
}

testOptimizeRoute().catch((err) => {
  console.error('💥 Error inesperado:', err);
  process.exit(1);
});
