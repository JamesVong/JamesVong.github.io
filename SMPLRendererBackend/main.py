import numpy as np
import pickle
import trimesh
from smplx import SMPL
import json
from flask import Flask, request, send_file
import os

app = Flask(__name__)
smpl = SMPL(model_path='models', gender='male', batch_size=1)

def load_smpl_params(pkl_file):
    with open(pkl_file, 'rb') as f:
        params = pickle.load(f, encoding="latin1")
    return params

def apply_rotation(pose, joint_id, rotation):
    rotation_rad = np.radians(rotation)
    pose[joint_id * 3:joint_id * 3 + 3] = rotation_rad
    return pose

def create_mesh(betas, pose):
    global_orient = pose[:3]  # First 3 values for global orientation
    body_pose = pose[3:]  # Remaining 69 values for body pose

    # Generate the mesh using the SMPL model
    output = smpl(betas=betas, body_pose=body_pose, global_orient=global_orient)

    # Convert the SMPL output to a mesh using Trimesh
    vertices = output.vertices.detach().cpu().numpy().squeeze()  # SMPL vertices
    faces = smpl.faces  # SMPL faces (topology remains the same)

    # Create a Trimesh object
    mesh = trimesh.Trimesh(vertices, faces)
    return mesh

@app.route('/generate_model', methods=['POST'])
def generate_model():
    data = request.json
    pkl_file = data['pkl_file']
    joint_id = data['joint_id']
    rotation = data['rotation']
    format = data['format']

    params = load_smpl_params(pkl_file)
    betas = np.zeros((10,))
    pose = np.zeros((24 * 3,))

    pose = apply_rotation(pose, joint_id, rotation)
    mesh = create_mesh(betas, pose)

    if format == 'gltf':
        export_path = 'temp_model.glb'
        mesh.export(export_path, file_type='glb')
    else:  # obj
        export_path = 'temp_model.obj'
        mesh.export(export_path, file_type='obj')

    # Send the file to the frontend
    return send_file(export_path, as_attachment=True)


if __name__ == '__main__':
    app.run(debug=True)