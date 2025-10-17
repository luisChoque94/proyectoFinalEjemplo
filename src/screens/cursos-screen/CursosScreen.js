import { useEffect, useState } from "react";
import { FlatList, Linking, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { getCourseContents, getUserCourses } from "../../services/moodle-cursos.js";

export default function CursosScreen({ route }) {
  console.log("🎯 CursosScreen - Iniciando con params:", route.params);
  const { token, userid } = route.params;
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        console.log("🔄 Obteniendo cursos para userid:", userid);
        const userCourses = await getUserCourses(token, userid);
        console.log("📚 Cursos obtenidos:", userCourses);

        const cursosConZooms = await Promise.all(
          userCourses.map(async (curso) => {
            console.log(`🔍 Buscando zooms para curso ${curso.id} - ${curso.fullname}`);
            const zooms = await getCourseContents(token, curso.id);
            console.log(`✅ Zooms encontrados para ${curso.fullname}:`, zooms);
            return { ...curso, zooms };
          })
        );

        console.log("🎉 Todos los cursos con zooms:", cursosConZooms);
        setCursos(cursosConZooms);
      } catch (error) {
        console.error("❌ Error cargando cursos:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, [token, userid]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10, color: '#666' }}>Cargando cursos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' }}>
        <Text style={{ color: 'red', textAlign: 'center' }}>
          Error: {error}
        </Text>
      </View>
    );
  }

  if (cursos.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text>No se encontraron cursos</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <FlatList
        style={{ flex: 1 }}
        data={cursos}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          paddingBottom: 100, // Espacio extra al final para los botones del sistema
          paddingHorizontal: 10, // Padding horizontal consistente
        }}
        renderItem={({ item }) => (
        <View
          style={{
            padding: 15,
            marginVertical: 5,
            borderRadius: 8,
            backgroundColor: "#f9f9f9",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          <Text style={{ 
            fontWeight: "bold", 
            fontSize: 16, 
            marginBottom: 10,
            color: "#2c3e50"
          }}>
            {item.fullname}
          </Text>

          {item.zooms && item.zooms.length > 0 ? (
            item.zooms.map((z) => {
              // Reemplazo la url
              const loadUrl = z.url.replace(
                "view.php?id=",
                "loadmeeting.php?id="
              );

              return (
                <View
                  key={z.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginVertical: 8,
                    backgroundColor: "white",
                    padding: 10,
                    borderRadius: 6,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 1,
                    elevation: 1,
                  }}
                >
                  <TouchableOpacity 
                    onPress={() => Linking.openURL(z.url)}
                    style={{
                      flex: 1,
                      marginRight: 10
                    }}
                  >
                    <Text style={{ 
                      color: "#2980b9",
                      fontSize: 14
                    }}>
                      • {z.name}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => Linking.openURL(loadUrl)}
                    style={{
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      backgroundColor: "#007AFF",
                      borderRadius: 6,
                      minWidth: 100,
                      alignItems: 'center'
                    }}
                  >
                    <Text style={{ 
                      color: "white", 
                      fontSize: 13,
                      fontWeight: '500'
                    }}>
                      Abrir en Zoom
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })
          ) : (
            <Text style={{ 
              color: "gray",
              fontStyle: 'italic',
              textAlign: 'center',
              marginTop: 10
            }}>
              No tiene Zoom
            </Text>
          )}
        </View>
      )}
      />
    </View>
  );
}
