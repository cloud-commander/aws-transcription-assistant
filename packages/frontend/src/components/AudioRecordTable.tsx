import * as React from 'react';
import {
    Header,
    Form,
    Table,
    Container,
    Popup,
    Button,
    Modal,
} from 'semantic-ui-react';

import axios from 'axios';

import TranscriptionEngine from "./../TranscriptionEngine";

import {
    API_PATH_PREFIX,
    TRANSCRIBED_TEXT_FILE_URL_PREFIX,
    AUDIO_FILE_URL_PREFIX,
} from '../constants';
import { getAudioType, getFileName } from '../utils';
import { AudioRecord, TranscriptionJSON, AUDIO_PROCESS_STATUS } from '../types';


export interface AudioRecordTableProps {}

export interface AudioRecordTableState {
    searchText: string;
    searchResults: AudioRecord[];
    /** the audio file whose transcription is opened */
    transcriptJSON?: string;
    activeAudioFileURL?: string;
    activeAudioFilename?: string;
    transcription?: TranscriptionJSON['results'];
    modalOpen: boolean;
    
}

export class AudioRecordTable extends React.Component<
    AudioRecordTableProps,
    AudioRecordTableState
> {
    constructor(props: AudioRecordTableProps) {
        super(props);
        this.state = {
            searchText: '',
            searchResults: [],
            transcriptJSON: undefined,
            activeAudioFileURL: undefined,
            activeAudioFilename: undefined,
            modalOpen: false,
        };
    }

    

    

    public render() {
        const {
            searchText,
            searchResults,
            transcription,
            transcriptJSON,
            activeAudioFilename,
            activeAudioFileURL
        } = this.state;
        return (
            <React.Fragment>
                <Header as="h2">Check transcription status v0.60</Header>
                <Form>
                    <Form.Group inline>
                        <Form.Input
                            label="Search audio transcription status"
                            action={{
                                color: 'teal',
                                icon: 'search',
                                content: 'Search',
                                onClick: this.handleSearch,
                            }}
                            value={searchText}
                            onChange={this.handleSearchTextChange}
                            placeholder="Record ID"
                        />
                        <label>(leave empty to show all)</label>
                    </Form.Group>
                </Form>
                {searchResults.length > 0 && (
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>ID</Table.HeaderCell>
                                <Table.HeaderCell>File Name</Table.HeaderCell>
                                <Table.HeaderCell>Status</Table.HeaderCell>
                                <Table.HeaderCell>Transcript</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {searchResults
                                .sort((a, b) => b.updatedAt - a.updatedAt)
                                .map(result => this.getRow(result))}
                        </Table.Body>
                    </Table>
                )}
                <Modal
                    open={this.state.modalOpen}
                    closeOnDimmerClick={false}
                    size={"large"}
                    dimmer={"blurring"}
                    onClose={this.handleModalClose}
                >
                    <Modal.Header as='h3'>{activeAudioFilename}</Modal.Header>
                    <Modal.Content>
                        <Container>
                        {console.log("transcriptJSON: " + this.state.transcriptJSON)}
                        {console.log("transcription (Blob): " + this.state.transcription)} 
                        {console.log("activeAudioFileURL: " + this.state.activeAudioFileURL)} 
                        <TranscriptionEngine transcriptJSON={transcriptJSON} mediaUrl ={activeAudioFileURL} audioTitle={activeAudioFilename}/>
                       
                        </Container>
                    </Modal.Content>
                    <Modal.Actions>
                    <Button
                        onClick={this.handleModalClose}
                        positive
                        color="red"
                        labelPosition="right"
                        icon="close"
                        content="Close"
                    />
          </Modal.Actions>
                </Modal>
            </React.Fragment>
        );
    }

    private getRow(result: AudioRecord) {
        const audioFileName = getFileName(result.audioUrl || '');
        
        return (
            <Table.Row key={result.id}>
                <Table.Cell>{result.id}</Table.Cell>
                <Table.Cell>{audioFileName.replace(/([^\_]+\_[^\_]+)\/?$/, "")}</Table.Cell>
                <Table.Cell>
                    {result.status ===
                    AUDIO_PROCESS_STATUS.TRANSCRIBE_FAILED ? (
                        <Popup
                            trigger={
                                <span className="error-status">
                                    {result.status}
                                </span>
                            }
                            content={result.error}
                        />
                    ) : (
                        result.status
                    )}
                </Table.Cell>
                
                <Table.Cell>
                    {result.textUrl && (
                        <Button
                            onClick={() => 
                                this.handleTextOpen(result.textUrl || '', audioFileName )
                                
                            }
                        >
                            Open
                        </Button>
                    )}
                </Table.Cell>
            </Table.Row>
        );
    }

  

    private handleSearch = () => {
        const { searchText } = this.state;
        axios
            .get<AudioRecord[]>(
                `/${API_PATH_PREFIX}/audios?recordId=${searchText || '*'}`
            )
            .then(results => {
                this.setState({ searchResults: results.data });
            });
    };

    private handleSearchTextChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const searchText = e.target.value;
        this.setState({
            searchText,
        });
    };

    private handleTextOpen(textUrl: string, audioFile: string) {
        if (textUrl) {
            const textFileName = getFileName(textUrl);
            const audioFileURL = "/" + AUDIO_FILE_URL_PREFIX + "/" + audioFile;
            axios
                .get<TranscriptionJSON>(
                    `/${TRANSCRIBED_TEXT_FILE_URL_PREFIX}/${textFileName}`
                )
                .then(result => {
                    this.setState({
                        transcriptJSON: `/${TRANSCRIBED_TEXT_FILE_URL_PREFIX}/${textFileName}`,
                        transcription: result.data.results,
                        activeAudioFileURL: audioFileURL,
                        activeAudioFilename: audioFile.replace(/([^\_]+\_[^\_]+)\/?$/, ""),
                        modalOpen: true,
                    });
                });
                   
            }
    }

    private handleModalClose = () => {
        this.setState({
            transcriptJSON: undefined,
            transcription: undefined,
            activeAudioFileURL: undefined,
            activeAudioFilename: undefined,
            modalOpen: false,
        });
    };
    

}
