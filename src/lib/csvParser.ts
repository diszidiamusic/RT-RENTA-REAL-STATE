import { Property, getAssetImage } from '../components/PropertyList';

export function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export function mapCsvRowToProperty(row: string[]): Omit<Property, 'id'> {
  const categoryRaw = row[0]?.trim() || '';
  const cod = row[1]?.trim() || '';
  const desc = row[2]?.trim() || '';
  const broker = row[3]?.trim() || '';
  const location = row[4]?.trim() || 'BARCELONA';
  const price = row[5]?.trim() || '';
  const surfaceRaw = row[6]?.trim() || '';
  const repercussion = row[7]?.trim() || '';
  const statusRaw = row[8]?.trim() || '';
  const activeBaja = row[9]?.trim() || '';
  const useRaw = row[10]?.trim() || '';
  const otherData = row[11]?.trim() || '';
  const investmentType = row[12]?.trim() || '';

  // Classify category nicely
  const catLower = categoryRaw.toLowerCase();
  let category: Property['category'] = 'edificios';
  if (catLower.includes('suelo') || catLower.includes('solar')) {
    category = 'solar';
  } else if (catLower.includes('hotel')) {
    category = 'hoteles';
  } else if (catLower.includes('indust') || catLower.includes('logis') || catLower.includes('finca')) {
    category = 'industrial';
  } else if (catLower.includes('edifici')) {
    category = 'edificios';
  } else if (catLower.includes('local')) {
    category = 'local';
  } else if (catLower.includes('oficina')) {
    category = 'oficinas';
  } else {
    category = 'singulares';
  }

  // Active status based on cell and operations status
  // activeBaja could be: 'ACTIVO', 'BAJA', 'VENDIDO', 'PENDIENTE'
  const activeBajaUpper = activeBaja.toUpperCase();
  const statusUpper = statusRaw.toUpperCase();
  const isBaja = 
    activeBajaUpper === 'BAJA' || 
    activeBajaUpper === 'VENDIDO' || 
    statusUpper === 'BAJA' || 
    statusUpper === 'VENDIDO' ||
    activeBajaUpper.includes('BAJA') ||
    activeBajaUpper.includes('VENDIDO') ||
    statusUpper.includes('BAJA') ||
    statusUpper.includes('VENDIDO');
  const isActive = !isBaja;

  // Selected high-quality building/land mock photos matching the active category
  const defaultImages: Record<Property['category'], string> = {
    edificios: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800',
    hoteles: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
    industrial: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
    solar: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
    local: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800',
    oficinas: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    singulares: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800'
  };

  let image = defaultImages[category] || defaultImages['edificios'];
  if (cod) {
    const customImg = getAssetImage(cod);
    if (customImg) {
      image = customImg;
    }
  }

  let formattedPrice = price;
  if (price && !price.includes('€') && price !== '0') {
    formattedPrice = `${price} €`;
  }

  return {
    title: desc || `Activo en ${location}`,
    type: useRaw || (category === 'solar' ? 'Suelo Urbanizable' : 'Activo Terciario'),
    location: location || 'BARCELONA',
    category,
    image,
    assetId: cod || undefined,
    situation: `Conveniente ubicación en la provincia de ${location}. ${otherData ? `Detalles adicionales: ${otherData}.` : 'Excelente acceso a vías principales.'}`,
    assetTypeDetail: `${categoryRaw} - Uso preferente: ${useRaw || 'Corporativo / Residencial / Terciario'}.`,
    surface: {
      solar: category === 'solar' ? surfaceRaw : undefined,
      built: category !== 'solar' ? surfaceRaw : undefined,
      year: '1985'
    },
    observations: {
      status: statusRaw || 'Disponible (Off-market)',
      annualExpenses: 'Consulte costos del portfolio completo',
      annualRent: investmentType || 'A estudio'
    },
    salePrice: formattedPrice || 'Consultar',
    repercussion: repercussion ? `${repercussion} €/m2` : undefined,
    yield: investmentType || 'A estudio',
    fees: '3% (No incluidos en el precio)',
    isActive,
    pdfUrl: 'https://arxiv.org/pdf/2103.15174.pdf' // High quality fallback sample PDF portfolio
  };
}

export function parseCSVToProperties(csvText: string): Omit<Property, 'id'>[] {
  const lines = csvText.split('\n');
  const properties: Omit<Property, 'id'>[] = [];
  
  // Skip header line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    try {
      const row = parseCSVLine(line);
      if (row.length < 3) continue; // Invalid row
      properties.push(mapCsvRowToProperty(row));
    } catch (e) {
      console.error('Failed to parse line:', line, e);
    }
  }

  return properties;
}

export const OFFICIAL_CSV_DATA = `CATEGORIA,COD.,DESCRIPCIÓN,BROKER,Población,PRECIO,SUPERFICIE EDIFICABILIDAD,REPERCUSIÓN,ESTADO OPERACIÓN,ACTIVO-BAJA,USO ESPECÍFICO,OTROS DATOS,TIPO INVERSIÓN
SUELO,SL-A141,Suelos Canet de Mar,LC,BARCELONA,"6.500.000,00","8.584,44","757,18",,ACTIVO,RESIDENCIAL,,
SUELO,SL-A149,SL-A149-Teia_Barrera,,BARCELONA,"650.000,00","1.150,00","565,22",,BAJA,RESIDENCIAL,9 viv. Libres + 4 VPO,
SUELO,SL-A162,SL-A162-Girona_IB,,GIRONA,"4.500.000,00","7.750,55","580,60",,VENDIDO,RESIDENCIAL,,
SUELO,SL-A170,SL-A170-Suelo La Quinta Málaga_PD,,MÁLAGA,,,,,BAJA,,,
SUELO,SL-A173,SL-A173-Suelo Altafulla_EP,,TARRAGONA,,,,,BAJA,HOTELERO,,
SUELO,SL-A174,SL-A174-Convent,FF,SABADELL,,,,,PENDIENTE,RESIDENCIAL,,
SUELO,SL-A175,SL-A175-Calafell Sant Antoni_FF,,TARRAGONA,,,,,BAJA,,,
SUELO,SL-A176,SL-A176-Calafell Bonaventura_FF,,TARRAGONA,,,,,BAJA,,,
SUELO,SL-A178,SL-A178- Suelo RESIDENCIAL Barbera_PD,,BARBERA,,,,,BAJA,,,
SUELO,SL-A179,SL-A179- Suelo Torrevieja Alicante_PD,,ALICANTE,,,,,BAJA,,,
SUELO,SL-A180,SL-A180-Suelos Cunit_DC,,TARRAGONA,,,,,BAJA,RESIDENCIAL,,
SUELO,SL-A184,"SL-A184- Suelos RESIDENCIAL en Av. Sant Esteve y C/ Sant Josep de Calassanç, Granollers_JCV",,GRANOLLERS,"930.000,00","1.686,00","551,60",,VENDIDO,RESIDENCIAL,,
SUELO,SL-A186,SL-A186-Suelo Lliça d´Amunt_JBA,,LLIÇA D´AMUNT,,,,,BAJA,,,
SUELO,SL-A187,SL-A187- Suelo Ind.Log. Mérida_CG,,MÉRIDA,,,,,BAJA,INDUSTRIAL,,
SUELO,SL-A188,SL-A188- Suelo Ind. Castellar del Vallès_Haya,,CASTELLAR,,,,,BAJA,INDUSTRIAL,,
SUELO,SL-A189,SL-A189-Suelo Sant Feliu Llobregat_MC,,SANT FELIU LLOBREGAT,,,,,BAJA,RESIDENCIAL,,
SUELO,SL-A190,SL-A190-Suelo Plutó 14-16_MC,,BARCELONA,,,,,BAJA,RESIDENCIAL,,
SUELO,SL-A191,SL-A191- Suelo Cortada,AK,BARCELONA,"705.000,00","600,00","1.175,00",,BAJA,RESIDENCIAL,,
SUELO,SL-A192,SL-A192-Suelo Massana_JMC,,ANDORRA,,,,,BAJA,,,
SUELO,SL-A193,SL-A193-Suelo RESIDENCIAL Manresa_Implica,IMPLICA,MANRESA,,,,,BAJA,RESIDENCIAL,,
SUELO,SL-A194,SL-A194-Suelo Muntanya_Granollers_JCV,,GRANOLLERS,"1.300.000,00","1.973,00","658,90",,BAJA,RESIDENCIAL,,
SUELO,SL-A195,SL-A195-Suelo Rosellón_Ferran,,BARCELONA,,,,,BAJA,RESIDENCIAL,,
SUELO,SL-A196,SL-A196-Suelo Calassanç_Sabadell_Ferran,,SABADELL,,,,,BAJA,RESIDENCIAL,,
SUELO,SL-A198,SL-A198-2 Suelos Gracia Repartidor_JC,,BARCELONA,,,,,BAJA,RESIDENCIAL,,
SUELO,SL-A199,SL-A199-Suelo Terciario 22@ PereIV Bcn_JLG,,BARCELONA,"10.500.000,00","11.306,79","928,65",,BAJA,TERCIARIO,,
SUELO,SL-A200,SL-A200-Suelo Sant Ferran Sabadell,JCV,SABADELL,"580.000,00","1.200,00","483,33",,VENDIDO,RESIDENCIAL,,
SUELO,SL-A201,"SL-A201-Suelo General Prim, Rubi_Culmia",,RUBI,,,,,BAJA,RESIDENCIAL,,
SUELO,SL-A202,"SL-A202-Suelo Camil, Cerdanyola_GM",,CERDANYOLA,,,,,BAJA,,,
SUELO,SL-A203,Suelo Manuel de Falla_Barbera,RR,BARBERA,"1.400.000,00","2.000,00","700,00",,ACTIVO,RESIDENCIAL,,
SUELO,SL-A205,SL-A205-Parcela Julia Lybica_Llivia_RR,,LLIVIA,,,,,BAJA,,,
SUELO,SL-A206,SL-A206-Parcela Zorrozaude_JLG,,BILBAO,,,,,BAJA,,,
SUELO,SL-A207,SL-A207-Suelo Antequera_JLG,,MÁLAGA,,,,,BAJA,,,
SUELO,SL-A208,SL-A208- Suelo Joan Güell _RP,,BARCELONA,,,,,BAJA,RESIDENCIAL,,
SUELO,SL-A210,SL-A210- Suelo Villar_MT,,BARCELONA,"1.280.000,00","1.078,00","1.187,38",,BAJA,RESIDENCIAL,,
SUELO,SL-A211,SL-A211- Suelo Passatge Badal_MT,,BARCELONA,"1.950.000,00","1.674,00","1.164,87",,BAJA,RESIDENCIAL,,
SUELO,SL-A212,SL-A212- Parcela Joaquin Costa_Esther,,SABADELL,"1.450.000,00","1.759,10","824,29",,BAJA,RESIDENCIAL,,
SUELO,SL-A213,SL-A213-Suelo Parets_B&G,,BARCELONA,"2.503.550,00","4.354,00","575,00",,BAJA,RESIDENCIAL,,
SUELO,SL-A214,SL-A214- Suelo Ampolla,CM,TARRAGONA,"800.000,00","4.000,00","200,00",,PENDIENTE,HOTELERO,,
SUELO,SL-A215,"SL-A215- Suelo Cami del Colomer, Manresa",SH,MANRESA,,,,,BAJA,RESIDENCIAL,,
SUELO,SL-A216,"SL-A216- Suelo Santa Eulalia, Terrassa",SH,TERRASSA,,,,,BAJA,RESIDENCIAL,,
SUELO,SL-A217,"SL-A217- Guadalajara, Terrassa",SH,TERRASSA,,,,,BAJA,RESIDENCIAL,,
SUELO,SL-A218,"SL-A218- Palet i Barba, Terrassa",SH,TERRASSA,,,,,BAJA,RESIDENCIAL,,
SUELO,SL-A219,"SL-A219- Suelo Prim_Sala i Badrinas, Terrassa",SH,TERRASSA,,,,,BAJA,RESIDENCIAL,,
SUELO,SL-A220,"Suelo Santa Marta, Terrassa",SH-RR,TERRASSA,"3.000.000,00","13.075,00","229,45",,ACTIVO,RESID. + TERCIARIO,141 Viviendas. 84 libres + 57 VPO,
SUELO,SL-A222,"Suelo Montevideo, Sant Boi",SH-RR,BARCELONA,"450.000,00","615,00","731,71",,ACTIVO,RESIDENCIAL,5 Viviendas,
SUELO,SL-A223,0,,MÁLAGA,,,,,BAJA,,,
SUELO,SL-A224,"SL-A224- Suelo Montserrat, Sabadell",GIRMED,SABADELL,,,,,PENDIENTE,TERCIARIO,,
SUELO,SL-A225a,Suelo Hotelero L´ametlla de Mar,SH-RR,TARRAGONA,"1.607.000,00","8.989,00","178,77",,ACTIVO,HOTELERO,,
SUELO,SL-A225b,Suelo Residencial L´ametlla de Mar,SH-RR,TARRAGONA,"2.444.100,00","7.840,00","311,75",,ACTIVO,RESIDENCIAL,43 Viviendas,
SUELO,SL-A226,SL-A226- Suelo Vilanova Escornalbou,CM,TARRAGONA,"3.000.000,00",,,,PENDIENTE,TERCIARIO,,
SUELO,SL-A227,SL-A227- Suelo HT en Hospitalet Infant,CM,TARRAGONA,"4.500.000,00","7.544,43","596,47",,PENDIENTE,HOTELERO,,
SUELO,SL-A228,SL-A228- Suelos Cambrils,CM,TARRAGONA,"2.500.000,00",,,,PENDIENTE,RESIDENCIAL,2 suelos,
SUELO,SL-A229,SL-A229- Suelo Ind. Cordoba,CM,CÓRDOBA,"1.890.950,00","8.142,00","232,25",,PENDIENTE,INDUSTRIAL,,
SUELO,SL-A230,SL-A230- Suelo Ind. Reus,CM,REUS,"5.064.115,00","15.926,00","317,98",,PENDIENTE,INDUSTRIAL,,
SUELO,SL-A231,SL-A231- Suelo Ind. Antequera,CM,MÁLAGA,"2.347.620,00","10.671,00","220,00",,PENDIENTE,INDUSTRIAL,,
SUELO,SL-A232,SL-A232- Suelo Ind. Valladolid,CM,VALLADOLID,"2.950.000,00","9.000,00","327,78",,PENDIENTE,INDUSTRIAL,,
SUELO,SL-A235,"SL-A235- Suelo en Mijas, Málaga_CM",,MÁLAGA,,,,,BAJA,,,
SUELO,SL-A236,"SL-A236- Suelo VilaSeca, Tarragona",CM,TARRAGONA,"4.000.000,00","6.926,00","577,53",,PENDIENTE,RESIDENCIAL,,
SUELO,SL-A237,"SL-A237- Suelo Camp Clar, Tarragona",CM,TARRAGONA,"3.400.000,00","6.176,34","550,49",,PENDIENTE,RESIDENCIAL,,
SUELO,SL-A240,SL-A240- Suelo Capellans_Sitges_DC,,BARCELONA,,,,,BAJA,,,
SUELO,SL-A241,SL-A241- Suelo Crta Martorell Arquimedes_RR,,TERRASSA,"1.750.000,00","2.592,02","675,15",,VENDIDO,RESIDENCIAL,,
SUELO,SL-A242,SL-A242- Suelo Logístico La Panadella_IE,,BARCELONA,"9.338.816,00","123.460,00","75,64",,BAJA,INDUSTRIAL,,
SUELO,SL-A243,"SL-A243- Suelo RESIDENCIAL Z. Forum, Barcelona_PL",,BARCELONA,"5.500.000,00","4.876,85","1.127,78",,BAJA,RESIDENCIAL,50 Viviendas aprox.,
SUELO,SL-A244,"SL-A244- Suelo Concepció Arenal, Terrassa_MR",,TERRASSA,"775.000,00","2.427,14","319,31",,VENDIDO,RESIDENCIAL,,
SUELO,SL-A245,"Suelo Lemoniers, Llavaneres",DC,BARCELONA,"13.000.000,00","7.060,00","1.841,36",,ACTIVO,RESIDENCIAL,19 Viviendas,
SUELO,SL-A246,"SL-A246- Suelo Cal, Madrid_PD",,MADRID,"3.600.000,00","2.682,00","1.342,28",,BAJA,RESIDENCIAL,33 Viviendas,
SUELO,SL-A247,SL-A247- Suelo Hotelero Cial Cala Mijas_PD,,MÁLAGA,"4.000.000,00","3.173,00","1.260,64",,BAJA,HOTELERO,,
SUELO,SL-A248,"SL-A248- Suelo RESIDENCIAL C/ Dante Alighieri, Barcelona_MT",,BARCELONA,"700.000,00","472,00","1.483,05",,VENDIDO,RESIDENCIAL,1 LOC. + 6 VIV. LIBRES,
SUELO,SL-A249,"SL-A249- Suelo C.Lepanto, Cambrils",CM,TARRAGONA,"1.350.000,00","911,45","1.481,16",,PENDIENTE,RESIDENCIAL,1 LOC. + 6 VIV.+1 ÁTICO,
SUELO,SL-A250,"SL-A250- Suelo C Borras, Cambrils_CM",,TARRAGONA,"700.000,00","1.940,00","360,82",,VENDIDO,RESIDENCIAL,22 Viviendas,
SUELO,SL-A251,"SL-A251- Suelo Av. Adelaida, Cambrils",CM,TARRAGONA,"1.000.000,00","2.929,50","341,36",,PENDIENTE,RESIDENCIAL,21 ADOSADOS,
SUELO,SL-A252,SL-A252- Parcelas Llavaneras_Port Balis,SH,BARCELONA,,,,,BAJA,,,
SUELO,SL-A253,"SL-A253- Suelo Mirador del Convent, Puigcerdà_JCV",JCV,PUIGCERDA,"800.000,00","1.214,26","658,84",,BAJA,RESIDENCIAL,12 Viviendas (10 libres),
SUELO,SL-A254,Suelo Equip. Rep. Argentina,TL,BARCELONA,"4.100.000,00","3.325,00","1.233,08",,ACTIVO,EQUIPAMIENTOS,,
SUELO,SL-A257,Suelo Resid. Vilafranca Penedes,TL,BARCELONA,"8.000.000,00","20.468,48","390,84",,ACTIVO,RESID. + TERCIARIO,215 Viviendas,
SUELO,SL-A259,"SL-A259- Suelo Foios, Valencia",LC,VALENCIA,"4.500.000,00","12.705,17","354,19",,PENDIENTE,RESIDENCIAL,141 Viviendas,
SUELO,SL-A260,"SL-A260- Suelo Navarra, Masnou",LC,BARCELONA,"1.000.000,00","928,21","1.077,34",,PENDIENTE,RESIDENCIAL,8-6 Viviendas,
SUELO,SL-A261,"Suelo Puigpelat, Valls, Tarragona",DC,TARRAGONA,"950.000,00","6.500,00","146,15",,ACTIVO,RESIDENCIAL,80 Viviendas o 41 unif.,
SUELO,SL-A262,"SL-A262- Suelo Ind. Joan Maragall12, Masnou",LC,BARCELONA,,,#DIV/0!,,PENDIENTE,,,
SUELO,SL-A263,"Suelo Log. Maçanet, Girona",TL,GIRONA,"33.100.000,00","107.170,79","308,85",,ACTIVO,LOGISTICO,,
SUELO,SL-A264,Suelo Aragón128,TL,BARCELONA,"3.500.000,00","2.050,00","1.707,32",,ACTIVO,OFICINA - RESIDENCIAL,,
SUELO,SL-A267,Suelos Moncada i Reixac,SH-RR,BARCELONA,"2.390.000,00","6.146,00","388,87",,ACTIVO,RESIDENCIAL,60 Viviendas,
SUELO,SL-A268,Suelo y Proy.Geriatrico Sant Vicenç dels Horts,TL,BARCELONA,"2.500.000,00","4.498,50","555,74",,ACTIVO,GERIATRICO,118 Plazas,
SUELO,SL-A269,Proyecto Madrid Nuevo Norte,PL,MADRID,"58.903.300,00","34.649,00","1.700,00",,ACTIVO,RESIDENCIAL,,
SUELO,SL-A271,"Suelo Conrad Vilar, Calonge",RR,GIRONA,"3.500.000,00","4.968,00","704,51",,ACTIVO,RESIDENCIAL,44 Viviendas,
SUELO,SL-A274,"Suelo Inmaculada, Mollet",MF,BARCELONA,"575.000,00","1.560,00","368,59",,ACTIVO,RESIDENCIAL,15 a 18 Viviendas,
SUELO,SL-A275,Suelo Martorell,MF,BARCELONA,"450.000,00","1.564,00","287,72",,ACTIVO,RESIDENCIAL,17 Viviendas,
SUELO,SL-A276,"Suelo OF_Sanit._Pere IV, 22@",MF,BARCELONA,"9.000.000,00","11.885,00","757,26",,ACTIVO,OFICINA - SANITARIO,,
SUELO,SL-A277,"Suelo Llombart, Hospitalet",MF,BARCELONA,"1.000.000,00","436,00","2.293,58",,ACTIVO,RESIDENCIAL,10 Apartamentos turisticos,
SUELO,SL-A278,Suelo Log. Castellet i La Gornal,TL,BARCELONA,"61.429.500,00","68.255,00","900,00",,ACTIVO,LOGISTICO,,
SUELO,SL-A279,Suelo Piera,TL,BARCELONA,"2.088.000,00","8.700,00","240,00",,ACTIVO,RESIDENCIAL,90 Viviendas,
SUELO,SL-A280,Suelo Ind. Log. Antequera,TL,MÁLAGA,"62.000.000,00","265.183,15","233,80",,ACTIVO,LOGISTICO,,
SUELO,SL-A281,Suelo Resid. Llagostera,TL,GIRONA,"4.950.000,00","23.972,13","206,49",,ACTIVO,RESIDENCIAL,124 Viviendas,
SUELO,SL-A282,Suelo Barbera AD-5_AD7,TL,BARCELONA,"18.000.000,00","19.365,00","929,51",,ACTIVO,RESID. + TERCIARIO,155 Viviendas,
SUELO,SL-A283,"Suelo Congost, Granollers",TL,BARCELONA,"500.000,00","1.128,50","443,07",,ACTIVO,RESIDENCIAL,15 Viviendas,
SUELO,SL-A284,"Suelo Narcis, Granollers",TL,BARCELONA,"240.000,00","540,00","444,44",,ACTIVO,RESIDENCIAL,6 Viviendas,
SUELO,SL-A285,Suelo Molins de Rei,TL,BARCELONA,"700.000,00","722,00","969,53",,ACTIVO,RESIDENCIAL,8 Viviendas,
SUELO,SL-A286,SL-A286- Suelo Senior Living La Alcaidesa,TL,,,,#DIV/0!,,BAJA,,,
SUELO,SL-A288,Suelo Ind.Log.Cardedeu,TL,BARCELONA,"8.000.000,00","17.600,95","454,52",,ACTIVO,LOGISTICO,,
SUELO,SL-A289,Suelo Ind. Suria,TL,BARCELONA,"4.000.000,00","22.418,00","178,43",,ACTIVO,INDUSTRIAL,,
SUELO,SL-A290,"Solar Resid. Santa Eulalia, Hospitalet",TL,BARCELONA,"11.500.000,00","12.971,38","886,57",,ACTIVO,RESIDENCIAL,130 Viviendas,
SUELO,SL-A291,Solar Proy.Ind. Sant Boi Llobregat,TL,BARCELONA,"15.000.000,00","14.665,49","1.022,81",,ACTIVO,INDUSTRIAL,PROYECTO LLAVE EN MANO,
SUELO,SL-A294,Suelo_Proy.Apart.Turisticos Sevilla,AK,SEVILLA,"4.500.000,00","1.000,00","4.500,00",,ACTIVO,RESIDENCIAL,14 Apartamentos turísticos,
SUELO,SL-A295,Suelo Vallromanes_MF,MF,BARCELONA,"1.750.000,00","2.500,00","700,00",,ACTIVO,RESIDENCIAL,15 Viviendas + 5 casas,
SUELO,SL-A296,Suelo Can Serra_Mataro,JCV,BARCELONA,"2.700.000,00","3.851,73","700,98",,ACTIVO,RESIDENCIAL,12 Viviendas,
EDIFICIO,ED-A049,"Av. Diagonal 318, Eixample Dret, Barcelona",,BARCELONA,"6.400.000,00","1.111,00","5.760,58",RENTABILIDAD,BAJA,, LICENCIA TURÍSTICA,PATRIMONIALISTA
EDIFICIO,ED-A107,Avda. Ciudad Barcelona (Madrid) Proyecto y licencia,,,"5.200.000,00","2.058,00","2.526,72",VACIO ,BAJA,,,
EDIFICIO,ED-A062,"C/ Picalquers 16, Raval, Barcelona",AK,BARCELONA,"950.000,00","292,00","3.253,42",RENTABILIDAD,PENDIENTE,COLIVING,,PATRIMONIALISTA
EDIFICIO,ED-A109,"C/ Aribau, 79, Barcelona",,,"3.500.000,00","1.246,00","2.808,99",RENTABILIDAD,BAJA,,,
EDIFICIO,ED-A110,"Passeig de la Salut 102, Santa Coloma Gramanet",,,"550.000,00","371,00","1.482,48",RENTABILIDAD,BAJA,,,
EDIFICIO,ED-A111,"C/ D´En Roig 8, El Raval, Barcelona",,,"620.000,00","486,00","1.275,72",VACIO,BAJA,,,
EDIFICIO,ED-A112,"C/ Llobregat 22, Hospitalet de Llobregat",,,"980.000,00","713,00","1.374,47",RENTABILIDAD,BAJA,,,
EDIFICIO,ED-A113,"C/ Calabria 56, Barcelona",,,"2.650.000,00","755,00","3.509,93",SEMIVACIO,BAJA,,,
EDIFICIO,ED-A114,"C/ Cortines 10, Born, Barcelona",,BARCELONA,"1.590.000,00","1.063,00","1.495,77",SEMIVACIO,BAJA,,,
EDIFICIO,ED-A115,"Pz. Las Palmeres 5B, Sant Andreu, Barcelona",,BARCELONA,"1.500.000,00","883,00","1.698,75",RENTABILIDAD,BAJA,,,PATRIMONIALISTA
EDIFICIO,ED-A116,"C/ Borrell, 20, Sant Cugat",,SANT CUGAT,"8.300.000,00","2.392,00","3.469,90",LLAVE EN MANO - RTDA.,BAJA,, OBRA NUEVA,PATRIMONIALISTA
EDIFICIO,ED-A117,"C/ Bonsoms 24, Sants Badal, Barcelona",,,"1.400.000,00","633,00","2.211,69",SEMIVACIO,BAJA,,,
EDIFICIO,ED-A118,"PJ. De La Pau 10, Gótico, Barcelona.",,BARCELONA,"9.500.000,00","2.852,00","3.331,00",SEMIVACIO,BAJA,,REVISIÓN,
EDIFICIO,ED-A068,"C/ Roser, 12, Poble Sec, Barcelona",,BARCELONA,"3.000.000,00","1.052,00","2.851,71",RENTABILIDAD,BAJA,, SIN INDEFINIDOS,PATRIMONIALISTA
EDIFICIO,ED-A120,"C/ Miquel Romeu43, Hospitalet, Barcelona",,BARCELONA,"2.100.000,00","447,00","4.697,99",LLAVE EN MANO - RTDA.,BAJA,, LICENCIA TURÍSTICA,PATRIMONIALISTA
EDIFICIO,ED-A121,"C/ Fernando El Católico 76, (Chamberí) Madrid.",,,"11.000.000,00","2.330,00","4.721,03",RENTABILIDAD,BAJA,,,
EDIFICIO,ED-A122,"C/ Miosotis 15, 28039, (Valdeacederas) Madrid",,MADRID,"2.300.000,00","701,00","3.281,03",RENTABILIDAD,BAJA,, COLIVING,PATRIMONIALISTA
EDIFICIO,ED-A123,"C/ Desengaño 16, 28004, Madrid",,MADRID,"5.200.000,00","1.052,00","4.942,97",VACIO REFORMADO,BAJA,, LLAVE EN MANO,PATRIMONIALISTA
EDIFICIO,ED-A124,"C/ Ventura Rodriguez 10, 28008, Madrid.",,MADRID,"4.000.000,00","1.129,00","3.542,96",VACIO A REHABILITAR,BAJA,,,
EDIFICIO,ED-A125,"C/ Marqués de Leis 8, 28020, Madrid.",,MADRID,"1.500.000,00","430,00","3.488,37",VACIO A REHABILITAR,BAJA,,,
EDIFICIO,ED-A126,"C/ Beire 3, 28039, Madrid.",,MADRID,"400.000,00","200,00","2.000,00",VACIO A REHABILITAR,BAJA,,,PROMOCIÓN
EDIFICIO,ED-A127,"C/ Mira El Sol 13, 28005, Madrid.",,MADRID,"7.900.000,00","2.477,83","3.188,27",VACIO A REHABILITAR,BAJA,, PROY.+LIC.,PROMOCIÓN
EDIFICIO,ED-A086,"C/ Carretes 36, Raval, Barcelona.",MF,BARCELONA,"2.300.000,00","911,00","2.524,70",RENTABILIDAD,PENDIENTE,,,PATRIMONIALISTA
EDIFICIO,ED-A129,"C/ República Argentina 236, Barcelona (Edif. Resid. Geriátrica)",,BARCELONA,"2.100.000,00","1.508,00","1.392,57",RENTABILIDAD,BAJA,,,
EDIFICIO,ED-A096,"C/ Portugal, 57, Barcelona",,BARCELONA,"1.400.000,00","714,00","1.960,78",RENTABILIDAD_REC.,BAJA,, 2 INDEFINIDOS,MIX_PROMO_PATRI
EDIFICIO,ED-A131,"C/ Calabria 137, Barcelona",,BARCELONA,"7.000.000,00","2.758,00","2.538,07",RENTABILIDAD_REC.,BAJA,,"INACTIVA, PROBLEMA CON INQUILINOS, KEVIN",MIX_PROMO_PATRI
EDIFICIO,ED-A132,"C/ Zurita 22 y C/ Buenavista 25, Madrid",,MADRID,"2.800.000,00","944,00","2.966,10",RENTABILIDAD_REC.,BAJA,,,MIX_PROMO_PATRI
EDIFICIO,ED-A097,"C/ Provença 74, 08029 Barcelona.",MC,BARCELONA,"7.050.000,00","1.450,00","4.862,07",RENTABILIDAD,PENDIENTE,, 1 INDEFINIDO,PATRIMONIALISTA
EDIFICIO,ED-A135,"C/ Vilafranca 26, Barcelona",,BARCELONA,"2.200.000,00","971,00","2.265,71",RENTABILIDAD,BAJA,, C. ALUMINOSO,PATRIMONIALISTA
EDIFICIO,ED-A136,"C/ Aribau, 32, Barcelona",,BARCELONA,"5.000.000,00","2.164,00","2.310,54",RENTABILIDAD_REC.,BAJA,, 4 INDEFINIDOS,MIX_PROMO_PATRI
EDIFICIO,ED-A106,"Pz. Pintor Cusachs 1, Mataró (Edif. Industrial cambio de uso Resid.)",RR,MATARÓ,"3.950.000,00","4.913,00","803,99",VACIO,PENDIENTE,,,PROMOCIÓN
EDIFICIO,ED-A119,"C/ Santa Carolina95, Barcelona (Edif. Oficinas, cambio de uso residencial)",,BARCELONA,"1.500.000,00","835,00","1.796,41",CAMBIO USO,BAJA,,,PROMOCIÓN
EDIFICIO,ED-A139,C/ Liuva74_Sant Andreu_Barcelona,,BARCELONA,"420.000,00","163,00","2.576,69",RENTABILIDAD,BAJA,,,PATRIMONIALISTA
EDIFICIO,ED-A140,C/ Portal Nou6_Barcelona,,BARCELONA,"950.000,00","210,00","4.523,81",RENTABILIDAD,BAJA,,,PATRIMONIALISTA
EDIFICIO,ED-A141,C/ Torns26_Barcelona,,BARCELONA,"1.450.000,00","824,00","1.759,71",RENTABILIDAD,BAJA,,2 INDEFINIDOS,PATRIMONIALISTA
EDIFICIO,ED-A142,"C/ Coll i Vehi 16, Barcelona",,BARCELONA,"1.250.000,00","532,00","2.349,62",RENTABILIDAD_REC.,BAJA,,,MIX_PROMO_PATRI
EDIFICIO,ED-A143,C/ Bacardi29_Barcelona,,BARCELONA,"4.150.000,00","1.654,00","2.509,07",RENTABILIDAD,BAJA,,6 INDEFINIDOS,PATRIMONIALISTA
EDIFICIO,ED-A144,"C/ RABASSA 36, GRACIA, Barcelona",,BARCELONA,"4.000.000,00","1.232,00","3.246,75",RENTABILIDAD,BAJA,,3 INDEFINIDOS,PATRIMONIALISTA
EDIFICIO,ED-A167,"C/ Enrique Eguren 3, Bilbao",,BILBAO,"7.300.000,00","4.000,00","1.825,00",VACIO A REHABILITAR,BAJA,,,MIX_PROMO_PATRI
EDIFICIO,ED-A130,"C/ Gomis 45, Gracia, Barcelona",,BARCELONA,"4.500.000,00","1.658,00","2.714,11",RENTABILIDAD,BAJA,, 7 INDEFINIDOS,PATRIMONIALISTA
EDIFICIO,ED-A147,"C/ Tamarit, 162, Barcelona",,BARCELONA,"3.800.000,00","578,40","6.569,85",RENTABILIDAD,BAJA,, LICENCIA TURÍSTICA,PATRIMONIALISTA
EDIFICIO,ED-A133,"C/ Santa Carolina, 81 - 95, Barcelona (2 edificios de oficinas)",,BARCELONA,"3.800.000,00","3.737,00","1.016,86",VACIO,BAJA,,,PROMOCIÓN
EDIFICIO,ED-A149,"C/ Reloj 6, Madrid",,MADRID,"5.000.000,00","990,97","5.045,56",VACIO A REHABILITAR,BAJA,,,MIX_PROMO_PATRI
EDIFICIO,ED-A150,"C/ San Carlos 3, Madrid",,MADRID,"3.500.000,00","967,00","3.619,44",VACIO A REHABILITAR,BAJA,,,MIX_PROMO_PATRI
EDIFICIO,ED-A151,"C/ Provenza 412, Barcelona",,BARCELONA,"10.800.000,00","2.056,35","5.252,02",RENTABILIDAD,BAJA,, MEDIA ESTANCIA,PATRIMONIALISTA
EDIFICIO,ED-A152,"Pj Garrofers12, Barcelona",,BARCELONA,"4.350.000,00","1.103,00","3.943,79",RENTABILIDAD,BAJA,, OBRA NUEVA,PATRIMONIALISTA
EDIFICIO,ED-A153,"C/ Leiva55, Barcelona",,BARCELONA,"1.650.000,00","742,00","2.223,72",RENTABILIDAD,BAJA,, 2 INDEFINIDOS,PATRIMONIALISTA
EDIFICIO,ED-A154,"C/ Campomanes 13, Madrid",,MADRID,"5.500.000,00","1.200,00","4.583,33",RENTABILIDAD_REC.,BAJA,,,MIX_PROMO_PATRI
EDIFICIO,ED-A155,"C/ Belén 3, Madrid",,MADRID,"12.000.000,00","1.745,50","6.874,82",RENTABILIDAD_REC.,BAJA,,,MIX_PROMO_PATRI
EDIFICIO,ED-A156,"C/ Santa Ana20, Madrid",,MADRID,"2.100.000,00","508,00","4.133,86",VACIO A REHABILITAR,BAJA,,,PROMOCIÓN
EDIFICIO,ED-A157,"Plaza Santa Cruz4, Madrid",,MADRID,"1.700.000,00","269,48","6.308,45",VACIO A REHABILITAR,BAJA,, LIC. HOSPEDAJE,PROMOCIÓN
EDIFICIO,ED-A158,"C/ Fernández de los Rios 56, Madrid",,MADRID,"13.000.000,00","1.706,53","7.617,80",LLAVE EN MANO - RTDA.,BAJA,, LLAVE EN MANO,PATRIMONIALISTA
EDIFICIO,ED-A159,"C/ Tamarit189, Barcelona",,BARCELONA,"2.900.000,00","1.000,00","2.900,00",RENTABILIDAD_REC.,BAJA,, 2 INDEFINIDOS,MIX_PROMO_PATRI
EDIFICIO,ED-A160,"C/ Lope de Vega 21, Madrid",,MADRID,"11.500.000,00","2.192,00","5.246,35",VACIO A REHABILITAR,BAJA,,,MIX_PROMO_PATRI
EDIFICIO,ED-A161,C/ Ganduxer 82,,BARCELONA,"3.200.000,00","679,05","4.712,47",VACIO A REHABILITAR,BAJA,,,MIX_PROMO_PATRI
EDIFICIO,ED-A162,"C/ León 8, Madrid",,MADRID,"11.500.000,00","1.061,00","10.838,83",RENTABILIDAD,BAJA,,,PATRIMONIALISTA
EDIFICIO,ED-A137,"C/ Garcia Robles 7, Barcelona",CG,BARCELONA,"1.450.000,00","418,00","3.468,90",RENTABILIDAD,BAJA,, MEDIA ESTANCIA,PATRIMONIALISTA
EDIFICIO,ED-A138,C/ Aragón 237-239_Barcelona,,BARCELONA,"15.000.000,00","3.266,00","4.592,77",RENTABILIDAD,BAJA,,6 INDEFINIDOS,PATRIMONIALISTA
EDIFICIO,ED-A145,C/ Rector Triador29_Barcelona,LLS,BARCELONA,"2.800.000,00","1.241,00","2.256,24",RENTABILIDAD,PENDIENTE,, 3 INDEFINIDOS,PATRIMONIALISTA
EDIFICIO,ED-A166,"C/ Arcs 8, Barcelona",,BARCELONA,"7.000.000,00","1.187,00","5.897,22",VACIO A REHABILITAR,BAJA,,,MIX_PROMO_PATRI
EDIFICIO,ED-A146,"C/ Montcada 261 Viveret 70, Terrassa (Edif. Industrial cambio de uso Residencial)",IMPLICA,TERRASSA,"2.000.000,00","9.139,00","218,84",VACIO,PENDIENTE,,,PROMOCIÓN
EDIFICIO,ED-A168,C/ Corretger 7 Barcelona,,BARCELONA,"650.000,00","259,00","2.509,65",RENTABILIDAD,BAJA,,,MIX_PROMO_PATRI
EDIFICIO,ED-A148,C/ Palos de la Frontera 18_Madrid,PD,MADRID,"3.200.000,00","1.172,39","2.729,47",VACIO A REHABILITAR,BAJA,, PROY.+LIC.,MIX_PROMO_PATRI
EDIFICIO,ED-A170,"C/ Unió 11, Barcelona",,BARCELONA,"1.500.000,00","755,00","1.986,75",RENTABILIDAD,BAJA,,,PATRIMONIALISTA
EDIFICIO,ED-A171,"C/ Boqueria 9, Barcelona",,BARCELONA,"1.700.000,00","619,00","2.746,37",RENTABILIDAD,BAJA,,,MIX_PROMO_PATRI
EDIFICIO,ED-A163,"C/ Roger de Flor 284, Barcelona",,BARCELONA,"4.000.000,00","1.545,00","2.589,00",RENTABILIDAD,BAJA,, 6 INDEFINIDOS,PATRIMONIALISTA
EDIFICIO,ED-A164,"c/ Monte Perdido 50, Madrid",PD,MADRID,"3.500.000,00","1.457,00","2.402,20",RENTABILIDAD,BAJA,, 3 INDEFINIDOS,PATRIMONIALISTA
EDIFICIO,ED-A175,"C/ San Hermenegildo 14, Madrid",,MADRID,"7.200.000,00","1.473,00","4.887,98",RENTABILIDAD,BAJA,,,MIX_PROMO_PATRI
EDIFICIO,ED-A217,"C/ Espiritu Santo 4, Madrid",,MADRID,"5.200.000,00","1.100,00","4.727,27",VACIO A REHABILITAR,BAJA,,,MIX_PROMO_PATRI
EDIFICIO,ED-A165,"C/ Mariscal 3-5, Málaga",PD,MÁLAGA,"3.980.000,00","2.788,46","1.427,31",VACIO A REHABILITAR,BAJA,,,MIX_PROMO_PATRI
EDIFICIO,ED-A169,"C/ Badajoz 10, Barcelona",JCV,BARCELONA,"2.800.000,00","643,00","4.354,59",RENTABILIDAD,BAJA,, LICENCIA TURÍSTICA,PATRIMONIALISTA
EDIFICIO,ED-A180,"C/ Cabestreros 18, Madrid",,MADRID,"3.800.000,00","1.012,00","3.754,94",VACIO A REHABILITAR,BAJA,, SIN INQUILINOS,MIX_PROMO_PATRI
EDIFICIO,ED-A181,"C/ Sardenya 265, Barcelona",,BARCELONA,"840.000,00","287,00","2.926,83",RENTABILIDAD_REC.,BAJA,, 1 INDEFINIDO,MIX_PROMO_PATRI
EDIFICIO,ED-A173,"c/ Pérez galdos 32, Barcelona",RR,BARCELONA,"3.900.000,00","1.744,00","2.236,24",RENTABILIDAD_REC.,PENDIENTE,,,MIX_PROMO_PATRI
EDIFICIO,ED-A183,"C/ Nogués 50, Barcelona",,BARCELONA,"1.400.000,00","518,00","2.702,70",VACIO A REHABILITAR,BAJA,, SIN INQUILINOS,MIX_PROMO_PATRI
EDIFICIO,ED-A184,"C/ Barcelona 5, El Prat del Llobregat, Barcelona",,BARCELONA,"2.350.000,00","1.540,00","1.525,97",RENTABILIDAD_REC.,BAJA,, 4 INDEFINIDOS,MIX_PROMO_PATRI
EDIFICIO,ED-A174,"C/ Joan D´Austria 101, Barcelona",,BARCELONA,"8.200.000,00","1.715,00","4.781,34",LLAVE EN MANO - RTDA.,BAJA,, OBRA NUEVA,PATRIMONIALISTA
EDIFICIO,ED-A26,"C/ Gran Vía nº 548, Barcelona",,,"8.500.000,00","2.681,00","3.170,46",VACIO,BAJA,,,
EDIFICIO,ED-A33,"C/ Rosselló nº 323, Eixample Dret, Barcelona",,,"14.000.000,00","4.255,00","3.290,25",VACIO,BAJA,,,
EDIFICIO,ED-A36,"C/ Sant Miquel 67, Barceloneta, Barcelona",,,"630.000,00","136,00","4.632,35",RENTABILIDAD,BAJA,,,
EDIFICIO,ED-A38,"Carretera de La Bordeta 92, Barcelona",,BARCELONA,"4.650.000,00","1.280,00","3.632,81",RENTABILIDAD,BAJA,,,
EDIFICIO,ED-A40,"C/ Valencia, 335, Eixample Dret, Barcelona",,,"9.000.000,00","1.748,00","5.148,74",RENTABILIDAD,BAJA,,,
EDIFICIO,ED-A41,"C/Gignàs, 22, Ciutat Vella, Barcelona",,,"5.750.000,00","1.401,00","4.104,21",VACIO OBRA NUEVA,BAJA,,,
EDIFICIO,ED-A42,"C/Metges, 16, Born, Barcelona",,,"4.200.000,00","859,00","4.889,41",VACIO OBRA NUEVA,BAJA,,,
EDIFICIO,ED-A47,"C/ Alemanya 60, Sabadell",,,"9.000.000,00","8.600,00","1.046,51",BUILT TO RENT,BAJA,,,
EDIFICIO,ED-A177,"C/ Rosellón 401, Barcelona",,BARCELONA,"3.900.000,00","668,94","5.830,12",VACIO OBRA NUEVA,BAJA,, OBRA NUEVA,PROMOCIÓN
EDIFICIO,ED-A50,"C/ Escorial 158, Gracia, Barcelona",,,"1.000.000,00","701,88","1.424,74",PROYECTO OBRA N.,BAJA,,,
EDIFICIO,ED-A51,"C/ Trinidad, nº 68, Málaga",,,"4.000.000,00","2.890,00","1.384,08",VACIO OBRA NUEVA,BAJA,,,
EDIFICIO,ED-A53,"C/ Telègraf nº 19, Hospital Sant Pau, Barcelona",,BARCELONA,"5.800.000,00","1.500,00","3.866,67",RENTABILIDAD,BAJA,,,PATRIMONIALISTA
EDIFICIO,ED-A54,"Avda. Diagonal, 438, Eixample Dret, Barcelona",,,"9.000.000,00","1.533,00","5.870,84",VACIO,BAJA,,,
EDIFICIO,ED-A57,"C/ Portal Nou,4, Born, Barcelona",,,"2.100.000,00","526,32","3.989,97",VACIO OBRA NUEVA,BAJA,,,
EDIFICIO,ED-A59,"C/ Sant Carles nº 52. Santa Coloma de Gramanet, Barcelona",,,"1.250.000,00","1.416,00","882,77",CAMBIO USO,BAJA,,,
EDIFICIO,ED-A176,"C/ Cicerón 12, Madrid",,MADRID,"1.940.000,00","578,51","3.353,44",RENTABILIDAD,BAJA,,,PATRIMONIALISTA
EDIFICIO,ED-A063,"C/ Valencia 102 / Calabria 177, Eixample Esquerra, Barcelona",,BARCELONA,"2.300.000,00","1.054,00","2.182,16",OFICINAS,BAJA,,DD,
EDIFICIO,ED-A64,"C/ Diputación 48, Eixample Esquerre, Barcelona.",,,"10.500.000,00","3.976,00","2.640,85",RENTABILIDAD,BAJA,,,
EDIFICIO,ED-A65,"C/ Enrique Granados, 32, Barcelona",,,"12.700.000,00","3.593,00","3.534,65",RENTABILIDAD,BAJA,,,
EDIFICIO,ED-A66,"C/ Industria 98 100, Sagrada Familia,  Barcelona.",,,"5.000.000,00","1.821,00","2.745,74",RENTABILIDAD,BAJA,,,
EDIFICIO,ED-A178,"C/ Sallares i Marra 77 – 81, Sabadell",DON PISO,SABADELL,"2.500.000,00","1.039,97","2.403,92",VACIO OBRA NUEVA,BAJA,, OBRA NUEVA,PROMOCIÓN
EDIFICIO,ED-A69,"C/ Pujades, 279, 22@, Barcelona",,,"8.060.000,00","2.075,95","3.882,56",VACIO OBRA NUEVA,BAJA,,,
EDIFICIO,ED-A71,"Calle Jaume Giralt 7, Born, Barcelona",,,"4.000.000,00","881,00","4.540,30",VACIO REFORMADO,BAJA,,,
EDIFICIO,ED-A72,"Avda. Josep Tarradelles 119, 08029 Barcelona",,BARCELONA,"9.500.000,00","3.008,00","3.158,24",RENTABILIDAD,BAJA,,,
EDIFICIO,ED-A73,"Passeig de la Riera de Ribes 9-11, Miralpeix (Sitges)Barcelona.",,,"6.000.000,00","1.719,00","3.490,40",VACIO OBRA NUEVA,BAJA,,,
EDIFICIO,ED-A76,"C/ Sant Sebastià, 151-155, Terrassa, Barcelona.",,,"2.000.000,00","1.009,00","1.982,16",VACIO OBRA NUEVA,BAJA,,,
EDIFICIO,ED-A77,"C/ Gran Vía de Les Corts Catalanes, 602, Barcelona.",,,"5.850.000,00","1.926,00","3.037,38",RENTABILIDAD,BAJA,,,
EDIFICIO,ED-A78,"C/ Méndez Núñez, 12, (Trafalgar) Born, Barcelona.",,BARCELONA,"1.850.000,00","732,00","2.527,32",RENTABILIDAD,BAJA,,,
EDIFICIO,ED-A079,"C/ Doctor Pagés, 73, Santa Coloma de Gramanet, Barcelona.",,BARCELONA,"690.000,00","589,00","1.171,48",RENTABILIDAD_REC.,BAJA,,,MIX_PROMO_PATRI
EDIFICIO,ED-A81,Edificio Residencia Universitaria en Alcalá de Henares (Madrid) Pack de 80 viviendas + 95 PK.,,,"7.500.000,00","5.090,00","1.473,48",VACIO,BAJA,,,
EDIFICIO,ED-A82,"Edificio Apartamentos Turísticos en Bormujos, Sevilla. (135 viviendas)",,,"7.900.000,00","9.431,05","837,66",VACIO,BAJA,,,
EDIFICIO,ED-A84,"C/ Blasco de Garay 30, Poble Sec, Barcelona",,,"1.625.000,00","853,00","1.905,04",RENTABILIDAD,BAJA,,,
EDIFICIO,ED-A85,"C/ Salva, 24, Poble Sec, Barcelona",,,"1.200.000,00","525,00","2.285,71",RENTABILIDAD,BAJA,,,
EDIFICIO,ED-A190,"C/ Guilleries 12, Barcelona",,BARCELONA,"1.820.000,00","364,00","5.000,00",RENTABILIDAD,BAJA,Rtda. 100% alquilado, Nuevo,PATRIMONIALISTA
EDIFICIO,ED-A87,"C/ Junta de Comerç 22, Raval, Barcelona.",,,"2.250.000,00","1.592,00","1.413,32",RENTABILIDAD,BAJA,,,
EDIFICIO,ED-A88,"C/ Gran Vía nº 558, Barcelona",,,"7.500.000,00","1.430,00","5.244,76",VACIO REFORMADO,BAJA,,,
EDIFICIO,ED-A89,"C/ Baixa de Sant Miquel 4, Barcelona",,,"3.500.000,00","917,00","3.816,79",RENTABILIDAD,BAJA,,,
EDIFICIO,ED-A90,"C/ General Manso, Sant Feliu de Llobregat",,,"5.950.000,00","4.017,12","1.481,16",BUILT TO RENT,BAJA,,,
EDIFICIO,ED-A95,"C/ Comte d´Urgell 78, Barcelona",,,"4.000.000,00","1.016,00","3.937,01",VACIO,BAJA,,,
EDIFICIO,ED-A182,"C/ Badajoz 17, Barcelona (3 escaleras)",,BARCELONA,"9.525.000,00","1.442,66","6.602,39",VACIO OBRA NUEVA,BAJA,, 4 INDEFINIDOS,PATRIMONIALISTA
EDIFICIO,ED-A185,"C/ Pedró de la Creu 27, Barcelona",,BARCELONA,"2.000.000,00","436,00","4.587,16",VACIO A REHABILITAR,BAJA,,,MIX_PROMO_PATRI
EDIFICIO,ED-A99,"C/ Bausa 13-15, Madrid (Edif. Terciario)",,,"10.000.000,00","3.052,00","3.276,54",RENTABILIDAD,BAJA,,,
EDIFICIO,ED-A186,"C/ Berenguer i Mallol 5-7, Barcelona",,BARCELONA,"3.100.000,00","954,00","3.249,48",RENTABILIDAD,BAJA,, 4 INDEFINIDOS,PATRIMONIALISTA
EDIFICIO,ED-A187,"C/ Emili i Roca 52, Barcelona",,BARCELONA,"600.000,00","421,89","1.422,17",VACIO A REHABILITAR,BAJA,,,MIX_PROMO_PATRI
EDIFICIO,ED-A196,"C/ Cortines 10, Born, Barcelona",SH,BARCELONA,"2.100.000,00","1.093,00","1.921,32",RENTABILIDAD_REC.,PENDIENTE,16 viv. + 1 local, 1 INDEFINIDO,MIX_PROMO_PATRI
EDIFICIO,ED-A189,"C/ Comte Borrell 145, Barcelona",,BARCELONA,"3.600.000,00","1.211,00","2.972,75",VACIO A REHABILITAR,BAJA,, SEMI ALQUILADO,MIX_PROMO_PATRI
EDIFICIO,ED-A197,"C/ Calderón de la Barca 45, Barcelona",,BARCELONA,"1.100.000,00","394,00","2.791,88",RENTABILIDAD_REC.,BAJA,5 viv. + 1 local + 1 estudio, 1 INDEFINIDO,MIX_PROMO_PATRI
EDIFICIO,ED-A191,"C/ Puerto Príncipe 63, Barcelona",,BARCELONA,"1.980.000,00","735,00","2.693,88",VACIO A REHABILITAR,BAJA,, 1 INDEFINIDO,MIX_PROMO_PATRI
EDIFICIO,ED-A192,"C/ Rossend Arús, 25-27, Hospitalet de Llobregat",,BARCELONA,"2.000.000,00","804,00","2.487,56",VACIO A REHABILITAR,BAJA,,,MIX_PROMO_PATRI
EDIFICIO,ED-A193,"C/ Nápoles, 314, Barcelona",,BARCELONA,"5.100.000,00","1.643,00","3.104,08",RENTABILIDAD_REC.,BAJA,, SIN INDEFINIDOS,MIX_PROMO_PATRI
EDIFICIO,ED-A194,"C/ Tapioles 15, Barcelona",,BARCELONA,"4.400.000,00","1.680,00","2.619,05",RENTABILIDAD_REC.,BAJA,, 5 INDEFINIDOS,MIX_PROMO_PATRI
EDIFICIO,ED-A195,"C/ Bisbe Laguarda, 14, Barcelona",,BARCELONA,"4.100.000,00","2.383,00","1.720,52",RENTABILIDAD_REC.,BAJA,, 2 INDEFINIDOS,MIX_PROMO_PATRI
EDIFICIO,ED-A198,"C/ Vallseca, 18, Barcelona",,BARCELONA,"1.800.000,00","1.294,00","1.391,04",RENTABILIDAD_REC.,BAJA,16 viv. + 1 local, 5 INDEFINIDOS,PATRIMONIALISTA
EDIFICIO,ED-A199,"C/ Tallers 5, Barcelona",,BARCELONA,"1.650.000,00","505,00","3.267,33",RENTABILIDAD_REC.,BAJA,7 viv. + 1 local, Precio negociable,PATRIMONIALISTA
EDIFICIO,ED-A201,"Avda. Paralelo, 97 bis, Barcelona",DC,BARCELONA,"1.300.000,00","1.138,00","1.142,36",VACIO A REHABILITAR,BAJA,Resid. - Almacén (Industrial)," Precio min.: 1,1M€",MIX_PROMO_PATRI
EDIFICIO,ED-A202,"C/ D´en Grassot 27, Barcelona",,BARCELONA,"2.300.000,00","655,00","3.511,45",RENTABILIDAD_REC.,BAJA,7 vivi. + 2 locales, A término,PATRIMONIALISTA
EDIFICIO,ED-A200,"C/ Batlló 9, Barcelona",,BARCELONA,"2.000.000,00","554,00","3.610,11",VACIO A REHABILITAR,BAJA,,,MIX_PROMO_PATRI
EDIFICIO,ED-A203,"C/ Sant Vicenç 51, Sabadell (Industrial)",GIRMED,SABADELL,"1.350.000,00","2.307,00","585,18",VACIO,PENDIENTE,COWORKING,,PATRIMONIALISTA
EDIFICIO,ED-A206,"C/ Fabra i Puig 234, Barcelona",,BARCELONA,"650.000,00","241,00","2.697,10",RENTABILIDAD_REC.,BAJA,2 viv. + 2 locales," 4,7% RTDA. BRUTA",PATRIMONIALISTA
EDIFICIO,ED-A207,"Passeig Maritim 28, MONT-ROIG DEL CAMP (43892), Miami Playa, Tarragona",CM,TARRAGONA,"4.500.000,00","2.823,00","1.594,05",RENTABILIDAD,PENDIENTE,TURÍSTICO 27 U., TURÍSTICO,PATRIMONIALISTA
EDIFICIO,ED-A204,"C/ Castanyer 13, Barcelona",,BARCELONA,"4.100.000,00","1.334,00","3.073,46",RENTABILIDAD_REC.,BAJA,,,MIX_PROMO_PATRI
EDIFICIO,ED-A208,"C/ Lepanto 1 y C/ Carme 6 - (dos edificios a reformar), Cambrils, Tarragona",CM,TARRAGONA,"1.500.000,00",,,VACIO A REHABILITAR,PENDIENTE,,,MIX_PROMO_PATRI
EDIFICIO,ED-A208b,"C/ Pescadors 25 (pack 13 viv.) Cambrils, Tarragona",CM,TARRAGONA,"2.995.000,00",,,RENTABILIDAD,PENDIENTE,13 VIVIENDAS, 5% RTDA.,PATRIMONIALISTA
EDIFICIO,ED-A188,"C/ Comte d´Urgell 105, Barcelona",,BARCELONA,"1.600.000,00","579,00","2.763,39",VACIO A REHABILITAR,BAJA,,,MIX_PROMO_PATRI
EDIFICIO,ED-A209,"C/ Comte d´Urgell 120, Barcelona",,BARCELONA,"4.250.000,00","1.656,00","2.566,43",VACIO A REHABILITAR,BAJA,, 2 INDEFINIDOS,MIX_PROMO_PATRI
EDIFICIO,ED-A211,"C/ Baixada de la PLana 16, Barcelona (Mixto Cial + geriátrico)",,BARCELONA,"7.249.000,00","2.170,00","3.340,55",RENTABILIDAD,BAJA,Comercial + Geriátrico,,PATRIMONIALISTA
EDIFICIO,ED-A210,"C/ Nou de la Rambla 26, Barcelona",,BARCELONA,"6.000.000,00","3.129,77","1.917,07",VACIO A REHABILITAR,BAJA,,,MIX_PROMO_PATRI
EDIFICIO,ED-A213,"C/ Nou de la Rambla137, Barcelona",IT,BARCELONA,"2.100.000,00","970,00","2.164,95",RENTABILIDAD_REC.,PENDIENTE,10 viv. + 1 local + 2 estudios,,MIX_PROMO_PATRI
EDIFICIO,ED-A212,"C/ Biada 3, Barcelona",,BARCELONA,"1.600.000,00","629,00","2.543,72",RENTABILIDAD_REC.,BAJA,,,MIX_PROMO_PATRI
EDIFICIO,ED-A205,Pz. Raspall,,,,,#DIV/0!,,BAJA,,,
EDIFICIO,ED-A214,"Pz. Dr. Letamendi, 25, Barcelona",ANA,BARCELONA,"9.000.000,00","1.860,00","4.838,71",RENTABILIDAD_REC.,PENDIENTE,,,MIX_PROMO_PATRI
EDIFICIO,ED-A172,"C/ Santa Mª de la Cabeza 60, Madrid",,MADRID,"14.200.000,00","2.974,51","4.773,90",VACIO OBRA NUEVA,BAJA,,,PROMOCIÓN
EDIFICIO,ED-A215,"C/ Ardemans62, Madrid",PD,MADRID,"3.920.000,00","618,00","6.343,04",RENTABILIDAD,BAJA,8 apart. turísticos,,PATRIMONIALISTA
EDIFICIO,ED-A216,"Plaza Mayor6, Madrid",,MADRID,"3.200.000,00","348,00","9.195,40",RENTABILIDAD,BAJA,,,PATRIMONIALISTA
EDIFICIO,ED-A223,"C/ Desfar 47, Barcelona",,BARCELONA,"750.000,00","526,00","1.425,86",VACIO A REHABILITAR,BAJA,8 viv. + 2 locales, Libre a reformar,MIX_PROMO_PATRI
EDIFICIO,ED-A218,"C/ Felia Fuster Viladecans 19, Barcelona",,BARCELONA,"3.800.000,00","1.000,00","3.800,00",RENTABILIDAD,BAJA,,,PATRIMONIALISTA
EDIFICIO,ED-A219,"C/ Edif. Resid. Blesa 34, Barcelona",,BARCELONA,"1.000.000,00","540,00","1.851,85",RENTABILIDAD_REC.,BAJA,,,MIX_PROMO_PATRI
EDIFICIO,ED-A220,C/ Feliu Casanova 9; Barcelona,,BARCELONA,"2.050.000,00","513,00","3.996,10",RENTABILIDAD,BAJA,,,PATRIMONIALISTA
EDIFICIO,ED-A225,"C/ Moianes 72, Barcelona",,BARCELONA,"900.000,00","430,00","2.093,02",RENTABILIDAD,BAJA,5 viv. + 1 local,,PATRIMONIALISTA
EDIFICIO,ED-A224,"C/ Blai 62, Barcelona",,BARCELONA,"975.000,00","619,00","1.575,12",RENTABILIDAD,BAJA,,,PATRIMONIALISTA
EDIFICIO,ED-A226,"C/ Sant Pere Mitja 17, Barcelona",,BARCELONA,"1.800.000,00","897,00","2.006,69",RENTABILIDAD_REC.,BAJA,10 viv. + 2 locales,,MIX_PROMO_PATRI
EDIFICIO,ED-A227,"C/ Entença 122 bis, Barcelona",,BARCELONA,"4.500.000,00","1.617,00","2.782,93",RENTABILIDAD_REC.,BAJA,20 viviendas + 2 locales, 5 indefinidos,MIX_PROMO_PATRI
EDIFICIO,ED-A228,"C/ Gran Sant Andreu 207, Barcelona",,BARCELONA,"750.000,00","400,00","1.875,00",VACIO A REHABILITAR,BAJA,1 local + 2 pisos,,MIX_PROMO_PATRI
EDIFICIO,ED-A229,"C/ Ecuador 27, Barcelona",,BARCELONA,"3.200.000,00","781,00","4.097,31",RENTABILIDAD_REC.,BAJA,10 viv. + 1 local, 1 Indefinido,PATRIMONIALISTA
EDIFICIO,ED-A230,"C/  26 Gener 1641, 16, Barcelona",RR,BARCELONA,"1.380.000,00","407,00","3.390,66",RENTABILIDAD_REC.,BAJA,,,PATRIMONIALISTA
EDIFICIO,ED-A231,"C/ Clos de Sant Francesc 9, Barcelona",MT,BARCELONA,"1.700.000,00","348,00","4.885,06",VACIO A REHABILITAR,PENDIENTE,3 viviendas,,MIX_PROMO_PATRI
EDIFICIO,ED-A232,"C/ Sant Pau 17, Barcelona",CM,BARCELONA,"7.050.000,00","1.467,00","4.805,73",RENTABILIDAD,PENDIENTE,, Libre - reformado,PATRIMONIALISTA
EDIFICIO,ED-A128,"C/ Miguel Fisac, Salamanca.",PD,SALAMANCA,"15.750.000,00","10.500,00","1.500,00",LLAVE EN MANO - RTDA.,BAJA,,,PROMOCIÓN
EDIFICIO,ED-A233,"C/ Mila i Fontanals 37, Barcelona",GIRMED,BARCELONA,"2.250.000,00","527,32","4.266,86",RENTABILIDAD_REC.,PENDIENTE,, Todos a término,MIX_PROMO_PATRI
EDIFICIO,ED-A108,Pz. Africa (Marbella). Edif. a rehabilitar y ampliar,PD,MARBELLA,"3.500.000,00","1.234,00","2.836,30",VACIO,BAJA,,,PROMOCIÓN
EDIFICIO,ED-A234,"C/ Consell de Cent 13, Barcelona",MC,BARCELONA,"2.000.000,00","971,00","2.059,73",RENTABILIDAD_REC.,PENDIENTE,, 1 indefinido,MIX_PROMO_PATRI
EDIFICIO,ED-A235,"C/ BuenosAires 60 y C/ Enrique Granados 94, Barcelona",PL,BARCELONA,"27.500.000,00","5.327,00","5.162,38",RENTABILIDAD_REC.,BAJA,Alq. Tradicional + coliving, 1 Indef. >90 años,PATRIMONIALISTA
EDIFICIO,ED-A236,"5 Edificios Hospitalet, Barcelona",IE,BARCELONA,"23.500.000,00","7.500,00","3.133,33",RENTABILIDAD_REC.,PENDIENTE,Alq. Tradicional + coliving,,MIX_PROMO_PATRI
EDIFICIO,ED-A237,"C/ Canvis Vells13, Born, Barcelona",KF,BARCELONA,"750.000,00","180,00","4.166,67",RENTABILIDAD,PENDIENTE,,,PATRIMONIALISTA
EDIFICIO,ED-A238,"C/ Grassot 37, Barcelona",,BARCELONA,"625.000,00","200,00","3.125,00",RENTABILIDAD,BAJA,,,PATRIMONIALISTA
EDIFICIO,ED-A239,"C/ Primavera12, Madrid",PD,MADRID,"3.700.000,00","465,00","7.956,99",LLAVE EN MANO - RTDA.,BAJA,6 viviendas + 2 locales,,PATRIMONIALISTA
EDIFICIO,ED-A240,"C/ Arturo Soria 231, Madrid (Dotacional)",PD,MADRID,"18.000.000,00","7.074,00","2.544,53",VACIO A REHABILITAR,BAJA,,,MIX_PROMO_PATRI
EDIFICIO,ED-A241,"C/ Cuesta St.Domingo11, Madrid",PD,MADRID,"14.500.000,00","2.700,00","5.370,37",VACIO A REHABILITAR,BAJA,21 viviendas + 1 local cial., Apart. Turísticos,MIX_PROMO_PATRI
EDIFICIO,ED-A242,"C/ Dña.Berenguela20, Madrid",PD,MADRID,"3.300.000,00","1.047,60","3.150,06",VACIO A REHABILITAR,BAJA,8 viviendas,,MIX_PROMO_PATRI
EDIFICIO,ED-A243,"C/ Cabestreros18, Madrid",PD,MADRID,"4.700.000,00","1.012,00","4.644,27",VACIO A REHABILITAR,BAJA,16 viviendas + 1 local,,MIX_PROMO_PATRI
EDIFICIO,ED-A244,"Plaza de la Provincia4, Madrid",PD,MADRID,"6.000.000,00","701,40","8.554,32",RENTABILIDAD_REC.,BAJA,5 viviendas + 1 local,,PATRIMONIALISTA
EDIFICIO,ED-A245,"C/ Cauce4, Torremolinos, Málaga",PD,MÁLAGA,"3.500.000,00","1.529,00","2.289,08",LLAVE EN MANO - RTDA.,BAJA,16 apart. Vacacionales + local,,PATRIMONIALISTA
EDIFICIO,ED-A246,"C/ Calabria 189, Barcelona",MF,BARCELONA,"1.200.000,00","320,00","3.750,00",RENTABILIDAD_REC.,PENDIENTE,5 VIVIENDAS,,MIX_PROMO_PATRI
EDIFICIO,ED-A247,"C/ Penedés 5, Barcelona",FF,BARCELONA,"2.600.000,00","832,00","3.125,00",RENTABILIDAD_REC.,PENDIENTE,11 VIVIENDAS + 2 LOCALES,,MIX_PROMO_PATRI
EDIFICIO,ED-A248,"C/ Bolivar 13, Barcelona",IT,BARCELONA,"1.700.000,00","580,00","2.931,03",RENTABILIDAD_REC.,PENDIENTE,7 VIVIENDAS,,MIX_PROMO_PATRI
EDIFICIO,ED-A249,"C/ Daguería 13, Barcelona",IT,BARCELONA,"4.100.000,00","923,00","4.442,04",RENTABILIDAD,PENDIENTE,6 VIVIENDAS + 2 LOCALES,,PATRIMONIALISTA
EDIFICIO,ED-A250,"C/ Carme 6, Cambrils",,TARRAGONA,"1.100.000,00","618,00","1.779,94",VACIO A REHABILITAR,BAJA,1 local + 4 viviendas + 1 Ático,,MIX_PROMO_PATRI
EDIFICIO,ED-A251,"C/ Sant Just4, Sta.Coloma, Barcelona",DC,BARCELONA,"1.100.000,00","1.051,00","1.046,62",VACIO A REHABILITAR,BAJA,,,MIX_PROMO_PATRI
EDIFICIO,ED-A252,"Carrer del Mossèn Jacint Verdaguer, 71 08620, Sant Vicenç del Horts (Barcelona)",,BARCELONA,"820.000,00","994,05","824,91",VACIO A REHABILITAR,BAJA,10 viviendas y 1 local,,MIX_PROMO_PATRI
EDIFICIO,ED-A253,"C/ Alegre de Dalt 49, 08024 Barcelona",MC,BARCELONA,"1.200.000,00","362,00","3.314,92",RENTABILIDAD_REC.,PENDIENTE,6 viviendas + 2 locales, 1 indefinido,MIX_PROMO_PATRI
EDIFICIO,ED-A254,Malgrat de Mar,DC,BARCELONA,,,,,PENDIENTE,,,
EDIFICIO,ED-A255,Pau Alsina30,DC,BARCELONA,,,,,PENDIENTE,,,
EDIFICIO,ED-A256,Torrent de les Flors 135,MF,BARCELONA,,,,,BAJA,,,
EDIFICIO,ED-A257,Diputación,TL,BARCELONA,"18.000.000,00","2.585,00","6.963,25",,ACTIVO,RESIDENCIAL,11 Viviendas + 6 locales comerciales,
EDIFICIO,ED-A259,Reus,TL,BARCELONA,"6.500.000,00","1.244,94","5.221,14",,ACTIVO,RESIDENCIAL,13 Viviendas + 1 local,
EDIFICIO,ED-A260,Concordia 9,MF,BARCELONA,,,,,PENDIENTE,,,
EDIFICIO,ED-A261,María Aguiló 3,MF,BARCELONA,,,,,PENDIENTE,,,
EDIFICIO,ED-A262,Ofic. Agricultura146,PL,BARCELONA,,,,,PENDIENTE,,,
EDIFICIO,ED-A264,Edif.s Chamberi,PL,BARCELONA,,,,,BAJA,,,
EDIFICIO,ED-A265,Santa Peronella,PL,BARCELONA,"2.250.000,00","387,00","5.813,95",,ACTIVO,RESIDENCIAL,,RENTABILIDAD
EDIFICIO,ED-A266,Santa Madrona,PL,BARCELONA,"4.000.000,00","795,00","5.031,45",,ACTIVO,RESIDENCIAL,,RENTABILIDAD
EDIFICIO,ED-A267,Clínica en Gracia,TL,BARCELONA,"3.300.000,00","879,00","3.754,27",,ACTIVO,CLÍNICA,,RENTABILIDAD
EDIFICIO,ED-A268,Edif. Rtda. Terrassa,MF,BARCELONA,,,,,PENDIENTE,,,
EDIFICIO,ED-A269,Edif. Turist. Malgrat,MF,BARCELONA,"5.000.000,00","5.578,00","896,38",,ACTIVO,APART. TURÍSTICOS,50 Apartamentos - 252 plazas,
EDIFICIO,ED-A270,"2 Edificios Pau Marsal, Terrassa",MF,BARCELONA,"4.000.000,00","3.682,40","1.086,25",,ACTIVO,RESIDENCIAL,38 Viviendas + 8 locales,RENTABILIDAD
EDIFICIO,ED-A271,Edif. Apart. Turísticos Salou,TL,TARRAGONA,"49.000.000,00","13.000,00","3.769,23",,ACTIVO,APART. TURÍSTICOS,119 Apartamentos turísticos + 131 plazas pk. + locales,
EDIFICIO,ED-A272,"Lote Edif. Parla, Madrid",PL,MADRID,,,,,BAJA,,,
EDIFICIO,ED-A273,"Edif. Progres, Hospitalet",ALF,BARCELONA,"2.800.000,00","952,00","2.941,18",,ACTIVO,COMERCIAL,,
EDIFICIO,ED-A274,5 Edif. Coliving Barcelona,PL,BARCELONA,"34.000.000,00","8.907,00","3.817,22",,ACTIVO,RESIDENCIAL,,`;
