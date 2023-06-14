import express from 'express';
import { Request, Response } from 'express';
import {Process, PrismaClient } from '@prisma/client';

const processPrismaClient = new PrismaClient();

export const getAllProcesses = async (req: Request, res: Response): Promise<void> => {
  try {
    const processes: Process[] = await processPrismaClient.process.findMany({});
    res.status(200).json({
      status: 'success',
      data: processes,
      nHits: processes.length, 
    });
  } catch (error) {
    console.log(error);
  }
}

export const getProcessById = async (req: Request, res: Response): Promise<void> => {
  try {
    const processId = req.params.id;
    const process: Process | null = await processPrismaClient.process.findUnique({
      where: {
        id: processId,
      },
    });
    res.status(200).json({
      status: 'success',
      data: process,
    });
  } catch (error) {
    console.log(error);
  }
}

export const createProcess = async (req: Request, res: Response): Promise<void> => {
  try {
    const processData: Process = req.body;
    const process: Process = await processPrismaClient.process.create({
      data: {
        firstName: processData.firstName,
        lastName: processData.lastName,
        phone: processData.phone,
        assignee: {connect: {id: processData.assigneeId}}
      }
    });
    res.status(201).json({
      status: 'success',
      data: process,
    });
  } catch (error) {
    console.log(error);
  }
}