import { ResponsivePage } from "../components/ResponsivePage";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import React, { FormEvent, useEffect, useState, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useConvalida } from "../hooks/convalida/useConvalida";
import { Convalida } from "../types/Convalida";
import axios from "axios";

const VerConvalida: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Convalida>();
  const { createConvalida } = useConvalida();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    console.log("VerConvalida.handleChange event.target.files", selectedFile);
    setFile(selectedFile);
  };

  const handleOnSubmit = async (data: Convalida, event: FormEvent) => {
    event.preventDefault();
    console.log("VerConvalida.handleSubmit this.state.file", file);

    const formData = new FormData();
    formData.append("files", file); // Asumiendo que 'file' está definido en tu componente

    const uploadRes = await axios({
      method: "POST",
      url: "http://localhost:1338/api/upload/",
      data: formData,
    });

    const pene = await axios({
      method: "GET",
      url: "http://localhost:1338/api/upload/files",
      data: formData,
    });

    console.log("Ver uploads", pene.data[pene.data.length - 1].url);

    console.log("VerConvalida.handleSubmit uploadRes", uploadRes);

    const convalida = {
      ...data,
    };

    convalida.foto_certificado = pene.data[pene.data.length - 1].url;
    console.log(convalida.foto_certificado)
    console.log(convalida)

    const response = await createConvalida(convalida, null);

    if (response) {
      await router.push("/mis-conferencias");
    }
  };

  return (
    <ResponsivePage>
      <div className="container mt-3 mb-4 header-mis-conferencias">
        <h2>Convalida conferencia</h2>
        <Link href="/mis-conferencias">
          <img src="/icon-forward.svg" alt="search" />
        </Link>
      </div>
      <div className="FileUpload">
        <Form
          className="envio-solicitud-form"
          onSubmit={handleSubmit(handleOnSubmit)}
        >
          <Form.Group className="inputs">
            <Form.Label>Conferencia</Form.Label>
            <Form.Control type="text" {...register("tema_conferencia")} />
            {errors.tema_conferencia && (
              <Form.Text className="text-danger">
                {errors.tema_conferencia.message}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="inputs">
            <Form.Label>
              Nombre de la institución o entidad organizadora
            </Form.Label>
            <Form.Control type="text" {...register("nombre_institucion")} />
            {errors.nombre_institucion && (
              <Form.Text className="text-danger">
                {errors.nombre_institucion.message}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="inputs">
            <Form.Label>Ubicación</Form.Label>
            <Form.Control type="text" {...register("ubicacion")} />
            {errors.ubicacion && (
              <Form.Text className="text-danger">
                {errors.ubicacion.message}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group controlId="formFileSm" className="mb-3">
            <Form.Label>Subir tu certificado</Form.Label>
            <Form.Control type="file" size="sm" onChange={handleChange} />
          </Form.Group>
          <Button type="submit" variant="success">
            ENVIAR
          </Button>{" "}
        </Form>
      </div>
    </ResponsivePage>
  );
};

export default VerConvalida;