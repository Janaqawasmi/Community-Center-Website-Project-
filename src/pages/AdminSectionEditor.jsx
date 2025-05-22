// src/pages/AdminSectionEditor.jsx
/*
This component is responsible for editing the contents of a specific section (like title, subtitle, programs, images, etc.).

It gets used when an admin selects a section to edit from the dashboard.
*/
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../components/firebase';
import { Box, TextField, Typography, Button, Container, CircularProgress } from '@mui/material';

export default function AdminSectionEditor() {
  const { id } = useParams();
  const [sectionData, setSectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const ref = doc(db, 'sections', id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setSectionData(snap.data());
      } else {
        alert('Section not found');
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setSectionData({ ...sectionData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const ref = doc(db, 'sections', id);
      await updateDoc(ref, sectionData);
      alert('Section updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Error saving data');
    }
    setSaving(false);
  };

  if (loading) return <CircularProgress sx={{ mt: 5 }} />;
  if (!sectionData) return null;

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" mb={3}>Edit Section: {id}</Typography>
      <TextField
        fullWidth
        label="Title"
        name="description_title"
        value={sectionData.description_title || ''}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Description"
        name="description"
        value={sectionData.description || ''}
        onChange={handleChange}
        multiline
        rows={6}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Hall Description Title"
        name="hallDescription_title"
        value={sectionData.hallDescription_title || ''}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Hall Description"
        name="hallDescription"
        value={sectionData.hallDescription || ''}
        onChange={handleChange}
        multiline
        rows={4}
        margin="normal"
      />
      {/* You can add more fields for goals, programs, etc. */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        sx={{ mt: 3 }}
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </Button>
    </Container>
  );
}
