import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SendIcon from "@mui/icons-material/Send";
import { styled } from "@mui/material/styles";
import Graph from "react-vis-network-graph";
import * as rdflib from "rdflib";
import axios from "axios";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [disableButton, setDisableButton] = useState(false);
  const [responsed, setResponsed] = useState(false);
  const [dataCleaned, setDataCleaned] = useState({});
  const [dataGraph, setDataGraph] = useState("");
  const [page, setPage] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [grafo, setGrafo] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setDisableButton(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const handleFileUpload = () => {
    const formData = new FormData();
    formData.append("csvFile", selectedFile);

    axios
      .post("http://localhost:4000/csv/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.data.status === "success") {
          setResponsed(true);
          setDataCleaned(response.data.dataClean);
          setDataGraph(response.data.ontology);
        }
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error al enviar el archivo:", error);
      });
  };

  const graph = {
    nodes: [
      { id: 1, label: "1", title: "node 1 tootip text" },
      { id: 2, label: "2", title: "node 2 tootip text" },
      { id: 3, label: "3", title: "node 3 tootip text" },
      { id: 4, label: "4", title: "node 4 tootip text" },
      { id: 5, label: "5", title: "node 5 tootip text" },
      { id: 6, label: "6", title: "node 6 tootip text" },
    ],
    edges: [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 2, to: 5 },
      { from: 2, to: 6 },
      { from: 6, to: 1 },
      { from: 5, to: 6 },
    ],
  };

  const options = {
    layout: {
      hierarchical: false,
    },
    edges: {
      color: "red",
    },
    height: "500px",
  };

  const events = {
    select: function (event) {
      var { nodes, edges } = event;
      console.log(edges);
      console.log(nodes);
    },
  };

  return (
    <div className="App">
      <header className="App-header">
        <nav>
          <div className="nav-brand">
            <h1>
              <Typography variant="h1" gutterBottom>
                Integración de la web semántica, ML y sistemas de recomendación
              </Typography>
            </h1>
          </div>
        </nav>
      </header>

      <main>
        <div>
          <Typography variant="h5" gutterBottom>
            Carga de datos
          </Typography>
          <Typography variant="body1" gutterBottom>
            Por favor cargue el archivo CSV que desea limpiar para la creacion
            del modelo ontologico y el entrenamiento del sistema de
            recomendación.
            <br />
            1. Cargue el archivo
            <br /> 2. Envie el archivo
            <br /> 3. Si todo esta en orden podra visualizar el resultado de la
            limpieza y el modelo ontologico
            <br />
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              color="success"
              onChange={handleFileChange}
              accept=".csv"
            >
              Cargar archivo
              <VisuallyHiddenInput type="file" />
            </Button>
            <>
              {disableButton && (
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  onClick={handleFileUpload}
                >
                  Enviar datos
                </Button>
              )}
            </>
          </Stack>
          <Divider />
        </div>
        <>
          {responsed && (
            <div>
              <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
                Procesamiento de datos
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <TableContainer component={Paper}>
                  <Table
                    sx={{ minWidth: 650 }}
                    aria-label="sticky table"
                    stickyHeader
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Titulo</TableCell>
                        <TableCell>Descripcion</TableCell>
                        <TableCell>Alcance</TableCell>
                        <TableCell>Interacciones</TableCell>
                        <TableCell>Veces compartido</TableCell>
                        <TableCell>Me gusta</TableCell>
                        <TableCell>Comentarios</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dataCleaned
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row.title}</TableCell>
                            <TableCell>{row.description}</TableCell>
                            <TableCell>{row.reach}</TableCell>
                            <TableCell>{row.interactions}</TableCell>
                            <TableCell>{row.shares}</TableCell>
                            <TableCell>{row.likes}</TableCell>
                            <TableCell>{row.comments}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={dataCleaned.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </TableContainer>
              </Stack>
              <Divider />
            </div>
          )}
        </>
        <>
          {responsed && (
            <div>
              <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
                Visualización del grafo
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                
              </Stack>
              <Divider />
            </div>
          )}
        </>
      </main>
    </div>
  );
}

export default App;
