
// Base URL hardcodeada que sabemos que funciona
const BASE_URL = 'https://aulavirtual.instituto.ort.edu.ar';

// 1. Login → devuelve token
export const loginMoodle = async (username, password) => {
  const url = `${BASE_URL}/login/token.php?username=${username}&password=${password}&service=moodle_mobile_app`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Error en login Moodle");
  return res.json(); // { token, privatetoken }
};

// 2. Obtener info de usuario → devuelve userid, fullname, etc.
export const getUserInfo = async (token) => {
  const url = `${BASE_URL}/webservice/rest/server.php?wstoken=${token}&wsfunction=core_webservice_get_site_info&moodlewsrestformat=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Error al obtener info de usuario");
  return res.json();
};

// 3. Obtener cursos por userid
export const getUserCourses = async (token, userid) => {
  const url = `${BASE_URL}/webservice/rest/server.php?wstoken=${token}&wsfunction=core_enrol_get_users_courses&userid=${userid}&moodlewsrestformat=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Error al obtener cursos");
  return res.json(); // array de cursos { id, fullname, shortname }
};

// 4. Obtener contenidos del curso (para buscar Zooms)
export const getCourseContents = async (token, courseid) => {
  const url = `${BASE_URL}/webservice/rest/server.php?wstoken=${token}&wsfunction=core_course_get_contents&courseid=${courseid}&moodlewsrestformat=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Error al obtener contenidos del curso");
  const data = await res.json();

  // Extraemos TODOS los módulos Zoom
  const zooms = [];
  data.forEach((section) => {
    section.modules.forEach((mod) => {
      if (mod.modname === "zoom") {
        zooms.push({
          id: mod.id,
          name: mod.name,
          url: mod.url,
        });
      }
    });
  });

  return zooms;
};
